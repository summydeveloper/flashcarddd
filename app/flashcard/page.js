"use client"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { collection, getDocs } from "firebase/firestore"
 
import { Grid, Box, Container, TextField, Typography, Paper, Button, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";


export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashCards] = useState([])
    const [flipped, setFlipped] = useState([]);
    const searchParams = useSearchParams()
    const search = searchParams.get('id')


    useEffect(() => {
        async function getFlashCard() {
            if (!search || !user) return
            const colref = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colref)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })

            })
            setFlashCards(flashcards)
            //  if(docSnap.exists()){
            //     const collections = docSnap.data().flashCards || []
            //     setFlashCards(collections)
            //  }
            //  else{ await setDoc(docref, {flashCards: []})}

        }
        getFlashCard()
    }, [user, search])
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }
    if (!isLoaded || !isSignedIn) {
        return <p> nOT signed in </p>
    }
    return(
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{
                mt: 4
            }}>
 
                        {flashCards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => {
                                        handleCardClick(flashcard.name)
                                    }}>
                                        <CardContent>
                                            <Box sx={{
                                                perspective: '1000px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                },
                                                '& > div > div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    padding: 2,
                                                    boxSizing: "border-box",
                                                    backfaceVisibility: "hidden",
                                                    display: "flex",
                                                    justifyContent: 'center',
                                                    alignItems: "center",
                                                },
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                },
                                            }}>
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
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
        </Container>
    )
}