"use client"
import getStripe from "@/utils/get-stripe";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid } from "@mui/material"
import { SignedIn, SignedOut, UserButton, } from "@clerk/nextjs";
import Head from "next/head";


export default function Home() {

 const handleSubmit = async()=>{
  const checkoutSession= await fetch('api/checkout_sessions',{
    method: 'POST',
    headers:{
      origin: 'https://localhost:3000'
    }
  })
  const checkoutSessionjson= checkoutSession.json()
  if(checkoutSession.statusCode === 500){
    console.error(checkoutSession.message)
    return
  }
  const stripe = await getStripe();
  const {error}= await stripe.redirectToCheckout({
    sessionId:checkoutSessionjson.id
  })
  if(error){
    console.warn(error.message)
  }
 }

  return (
    <Container maxwidth="100vw">
      <Head>
        <title>Flashcard Saas </title>
        <meta name="description" content="create flashacrd from text in seconds" />
      </Head>
      <AppBar position="static">
        <Toolbar >
          <Typography variant="h6" style={{ flexGrow: 1 }}> Flashcard SAAS</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">   Login </Button>
            <Button  color="inherit" href="/sign-up">Sign Up </Button>
          </SignedOut>
          <SignedIn>  <UserButton /> </SignedIn>
        </Toolbar>
      </AppBar>
      <Box>
        <Typography variant="h2" gutterBottom>Welcome to FLASHCARD SAAS</Typography>
        <Typography variant="h5" gutterBottom>{''} The easiest way to create flashcardb     </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/generate">Get Started</Button>
      </Box>
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom >
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid xs={12} md={4}>
            <Typography variant="h6">Easy text input</Typography>
            <Typography>Simply input your text and let our software do the rest. Create flashcards just got easier</Typography>
          </Grid>
          <Grid xs={12} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>Simply input your text and let our software do the rest. Create flashcards just got easier</Typography>
          </Grid>
          <Grid xs={12} md={4}>
            <Typography variant="h6">Accessible anywhere</Typography>
            <Typography>Simply input your text and let our software do the rest. Create flashcards just got easier</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>

        <Grid container spacing={4}>

          <Grid xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: "1px solid black",
              borderColor: "gray",
              borderRadius: 2
            }}>

              <Typography variant="h5" gutterBottom>BASIC</Typography>
              <Typography variant="h6" gutterBottom>5$ / month</Typography>

              <Typography>Access to basic feature. Limited Storage</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>choose basic</Button>

            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: "1px solid black",
              borderColor: "gray",
              borderRadius: 2
            }}>

              <Typography variant="h5" gutterBottom>PRO</Typography>
              <Typography variant="h6" gutterBottom>10$ / month</Typography>

              <Typography>Access to all features. UnLimited Storage</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>choose pro</Button>

            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
 