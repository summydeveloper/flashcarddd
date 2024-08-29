// "use client"

// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import { collection, CollectionReference, doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "@/firebase";
// import { useRouter } from "next/navigation";
// import { CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";

// export default function flashCards(){
// const {isLoaded, isSignedIn, user} = useUser();
// const [flashCards, setFlashCards] = useState([]);
// const router = useRouter()
// useEffect(()=> {
// async function getFlashCards(){
//     if(!user) return
//      const docref = doc(collection(db, 'users'), user.id)
//      const docSnap = await getDoc(docref)
//      if(docSnap.exists()){
//         const collections = docSnap.data().flashCards || []
//         setFlashCards(collections)
//      }
//      else{ await setDoc(docref, {flashCards: []})}

// }
// getFlashCards()
// }, [user])
// if(!isLoaded || !isSignedIn){
//    return <></>
// }
// const handleCardClick= (id)=>{
//    router.push(`/flashcard?id=${id}`)
// }
// return <Container maxWidth="100vw">
// <Grid container spacing={3} sx={{
// mt: 4
// }}>
// {
//    flashCards.map((flashcard, index)=>(
//       <Grid item xs={12} sm={6} md={4}  key={index}>
//          <Card>
//             <CardActionArea onClick={()=>{
//                handleCardClick(id)
//             }}>
//                <CardContent>
//                   <Typography variant="h6">
//                      {flashcard.name}
//                   </Typography>
//                </CardContent>
//             </CardActionArea>
//          </Card>
//       </Grid>
//    ))
// }
// </Grid>
// </Container>
// }

"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";

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
        const collections = docSnap.data().flashCards || [];
        if (Array.isArray(collections)) {
          setFlashCards(collections);
        } else {
          console.error('Unexpected data format for flashCards:', collections);
        }
      } else {
        await setDoc(docRef, { flashCards: [] });
      }
    }
    getFlashCards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <Container maxWidth="100vw">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashCards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Typography variant="h6">
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
