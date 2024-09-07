 
"use client"

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { Grid, Box, Container, TextField, Typography, Paper, Button, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { collection, doc, getDoc, writeBatch, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashCards, setFlashCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const response = await fetch('api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            const data = await response.json();
            setFlashCards(data);
        } catch (error) {
            console.error('Error generating flashcards:', error);
            alert('An error occurred while generating flashcards. Please try again.');
        }
    };

    const handleCardClick = (id) => {
        setFlipped(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashCards = async () => {
        if (!name) {
            alert('Please enter a name for your flashcards');
            return;
        }
        try {
            const userDocRef = doc(collection(db, 'users'), user.id);
            const userDocSnap = await getDoc(userDocRef);
            const batch = writeBatch(db);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const updatedSets = [...(userData.flashCardsSets || []), { name }];
                batch.update(userDocRef, { flashCardsSets: updatedSets });
            } else {
                batch.set(userDocRef, { flashCardsSets: [{ name }] });
            }

            const setDocRef = doc(collection(userDocRef, 'flashCardsSets'), name);
            batch.set(setDocRef, { flashCards });
            await batch.commit();
            alert('Flashcards saved successfully!');
            handleClose();
            router.push('/flashcards');
            setName('');
        } catch (error) {
            console.error('Error saving flashcards:', error);
            alert('An error occurred while saving flashcards. Please try again.');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            {/* Header Section */}
            <Box sx={{
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Generate Flashcards
                </Typography>
            </Box>

            {/* Input Section */}
            <Paper sx={{
                p: 4,
                width: '100%',
                maxWidth: '600px',
                mx: 'auto',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px'
            }}>
                <TextField
                    label="Enter Text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Button
                    variant='contained'
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    sx={{ py: 1.5 }}
                >
                    Submit
                </Button>
            </Paper>

            {/* Flashcards Section */}
            {flashCards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Generated Flashcards
                    </Typography>
                    <Grid container spacing={3}>
                        {flashCards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{
                                    height: '100%',
                                    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
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
                                                    textAlign: 'center'
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
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Save Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashCards} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

