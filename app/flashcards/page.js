 
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, CardContent, Container, Grid, Typography, Box } from "@mui/material";

export default function FlashCards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashCards, setFlashCards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashCards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashCardsSets || [];
        setFlashCards(collections);
      } else {
        await setDoc(docRef, { flashCardsSets: [] });
      }
    }
    getFlashCards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <Typography variant="h6" align="center">Please sign in to view your flashcards.</Typography>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Your Flashcard Collections
      </Typography>
      <Grid container spacing={3}>
        {flashCards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.name}>
            <Card sx={{
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
              }
            }}>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" component="h2" noWrap>
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {flashCards.length === 0 && (
          <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
            <Typography variant="h6">
              You dont have any flashcards yet. Create some to get started!
            </Typography>
            

          </Box>
        )}
      </Grid>
    </Container>
  );
}
