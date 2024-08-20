'use client'

import * as React from 'react'
import getStripe from "@/utils/get-stripe";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import { Button, Container, AppBar, Toolbar, Typography, Box, Grid, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Head from "next/head";

const darkTheme = createTheme({
  palette:{
      mode: 'dark',
  },
})

export default function Home() {

  const handleSubmit = async () => {
    
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if(error){
      console.warn(error.message)
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> 
      <Container maxWidth="2000px" >
        <Head>
          <title>FlaCa</title>
          <meta name="description" content="Create flashcards from your prompts using AI tools" />
        </Head>

        <AppBar component='nav'>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}> 
              FlaCa </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in"> Login</Button>
              <Button color="inherit" href="/sign-up"> Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Box sx={{textAlign: 'center', my: 9, color: 'grey.300'}}>
          <Typography variant="h2" gutterBottom > Welcome to FlaCa </Typography>
          <Typography variant="h5" gutterBottom> 
            {' '}
            The easiest way to create flashcards from scratch 
          </Typography>
          <SignedOut>
            <Button variant="contained" bgcolor ='121212' sx={{ mt: 4 }} href='/sign-in'>Get Started</Button>
          </SignedOut>
          <SignedIn>
            <Button variant="contained" bgcolor="rgba(255, 255, 255, 0.08)" sx={{ mt: 4 }} href='/generate'>Get Started</Button>
          </SignedIn>
        </Box>
        <Box sx={{ my: 6 }} textAlign='center' color='grey.300'>
          <Typography variant="h3" gutterBottom >Features</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom> Easy Text Input</Typography>
              <Typography > 
                {' '}
                Simply paste your text and we'll create flashcards for you.
                Creating flashcards has never been easier. 🤩🤩🤩
              </Typography> 
            </Grid><Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom color='inherit'> Smart Flashcards</Typography>
              <Typography> 
                {' '}
                Our AI will automatically create flashcards for you, perfect for studying.
              </Typography>
            </Grid><Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom> Accessible Anywhere</Typography>
              <Typography> 
                {' '}
                Access your flashcards from anywhere, on any device. Study on the go with ease.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Container maxWidth='2000px' maxHeight='350px'>
        <hr/>
        <Box height='350px' sx={{ md: 6, textAlign: 'center'}}>
          <Typography variant="h4" marginTop={3} gutterBottom> FlaCa Pro </Typography> 
          <Grid container spacing={4} >
            <Grid item xs={12} md={12} lg={12}>
            <Box sx={{
                p: 2,
                border: '1px solid',
                borderRadius: 2,
              }}>
              <Typography variant="h5"gutterBottom > Pro</Typography>
              <Typography variant="h6" gutterBottom
              > $10 / month</Typography>
              <Typography> 
                {' '}
                Unlimited flashcards and storage, with priority support.
              </Typography> 
              <Button sx={{mt: 2}} onClick={handleSubmit}> Choose Pro</Button>
              </Box>
              </Grid>
          </Grid>
        
        </Box>
      </Container>
    </ThemeProvider>
  )
}
