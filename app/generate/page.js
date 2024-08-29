"use client"

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs"
import { Grid, Box, Container, TextField, Typography, Paper, Button, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { collection, doc, getDoc, writeBatch, setDoc,  } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashCards, setFlashCards] = useState([])
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        }).then((res) => res.json()).
            then((data) => setFlashCards(data))
    }
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const saveFlashCards = async () => {
        if (!name) {
            alert("please enter a name")
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, "users"), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('flashcard colection with the same name already exists')
                return
            } else {
                collections.push({ name })
                batch.set(userDocRef, { flashCards: collections }, { merge: true })
            }

        } else {
            batch.set(userDocRef, { flashCards: { name } })

        }
        const colRef = collection(userDocRef, name)
        flashCards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })


        await batch.commit()

        alert('Flashcards saved successfully!')
        handleClose()
        router.push('/flashcards')

    }

    return (
        <Container>
            <Box sx={{
                mt: 4,
                mb: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h4">
                    Generate Flashcards
                </Typography>
                <Paper sx={{ p: 4, width: '100%' }}>
                    <TextField label="Enter Text" fullWidth rows={4} variant="outlined" sx={{
                        mb: 2
                    }} multiline value={text} onChange={(e) => setText(e.target.value)} />
                    <Button variant='contained' color="primary" onClick={handleSubmit} fullWidth> Submit</Button>
                </Paper>
            </Box>
            {flashCards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Generated Flashcards
                    </Typography>
                    <Grid container spacing={3}>
                        {flashCards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => {
                                        handleCardClick(index)
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
                    <Box sx={{
                        mt: 4,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle> Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please eter a name for your flashcards colection
                    </DialogContentText>
                    <TextField autoFocus margin="dense" label=" collection name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} variant="outlined" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashCards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>)

}
