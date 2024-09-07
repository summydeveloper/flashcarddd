"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { Grid, Box, Container, Typography, Card, CardActionArea, CardContent } from "@mui/material";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashCards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashCard() {
            if (!search || !user) {
                console.log('No search parameter or user is not signed in.');
                return;
            }

            try {
                console.log('Fetching flashcards for user:', user.id, 'and search:', search);

                // Reference to the specific document in the flashCardsSets collection
                const flashcardsDocRef = doc(db, 'users', user.id, 'flashCardsSets', search);
                const docSnapshot = await getDoc(flashcardsDocRef);

                if (!docSnapshot.exists()) {
                    console.log('No flashcards found.');
                } else {
                    const data = docSnapshot.data();
                    console.log('Document data:', data);

                    // Assuming `flashCards` is the field containing the array of flashcards
                    const flashcards = data.flashCards || [];
                    setFlashCards(flashcards);
                }
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        }

        getFlashCard();
    }, [search, user]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return <Typography variant="h6" align="center">Not signed in</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Your Flashcards
            </Typography>
            <Grid container spacing={4}>
                {flashcards.length > 0 ? (
                    flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{
                                borderRadius: '8px',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                                }
                            }}>
                                <CardActionArea onClick={() => handleCardClick(index)}>
                                    <CardContent>
                                        <Box sx={{
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '200px',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                                borderRadius: '8px',
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            },
                                            '& > div > div': {
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                borderRadius: '8px',
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)',
                                            },
                                        }}>
                                            <div>
                                                <div>
                                                    <Typography variant="h6" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h6" component="div">
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography variant="h6">
                                No flashcards available. Please create some to get started!
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}
