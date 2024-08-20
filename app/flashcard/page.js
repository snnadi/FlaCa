'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import {AppBar, Toolbar,ThemeProvider, createTheme, CssBaseline, Container, TextField, Button, Typography, Box, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CardActionArea, CardContent, Grid, Card } from '@mui/material'

const darkTheme = createTheme({
  palette:{
      mode: 'dark',
  },
})

export default function Flashcard(){
   const { isLoaded, isSignedIn, user } = useUser()
   const [flashcards, setFlashcards] = useState([])
   const [flipped, setFlipped] = useState([])

   const searchParams = useSearchParams()
   const search = searchParams.get('id')

   useEffect(() => {
      async function getFlashcard() {
         if(!search || !user) return
         const colRef = collection(doc(collection(db, 'users'), user.id), search)
         const docs = await getDocs(colRef)
         const flashcards = []

         docs.forEach((doc) => {
            flashcards.push({id: doc.id, ...doc.data()})
         })
         setFlashcards(flashcards)
      } 
      getFlashcard()
   }, [user, search])
   
   const handleCardClick = (id) => {
      setFlipped((prev) => ({
        ...prev,
        [id]: !prev[id]
      }))
    }

    if (!isLoaded  || !isSignedIn ){
      return <></>
    }

    return (
      <ThemeProvider theme={darkTheme}><CssBaseline/>
        <Container maxWidth='100vw'>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}> FlaCa </Typography>
              <SignedOut>
                <Button color="inherit" href="/sign-in"> Login</Button>
                <Button color="inherit" href="/sign-up"> Sign Up</Button>
              </SignedOut>
              <SignedIn>
                <Button color='inherit' href='/'>Home</Button>
                <UserButton />
              </SignedIn>
            </Toolbar>
          </AppBar>
          <Grid container spacing = {3} sx={{ mt:4 }}>
          {flashcards.length > 0 && (
            <Box width ='100vw' sx={{ mt: 4 ,}} textAlign='center'>
              <Grid container spacing={3}>
                {flashcards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined" >
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
                              boxShadow: '0px 4px 8px 0 rgba(0,0,0,0.2)',
                            
                              transform: flipped[index]
                                ? 'rotateY(180deg)'
                                : 'rotateY(0deg)',
                            },
                            '& > div > div': {
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                              overflowY: 'auto', // Enable vertical scrolling
                              maxHeight: '200%', // Set max height for scrolling
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
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              </Box>
            </Box>
          )}
          </Grid>
        </Container>
      </ThemeProvider>
    )
}