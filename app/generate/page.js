'use client'
import { useUser } from '@clerk/nextjs'
import {db} from '@/firebase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore'
import { Container, TextField, Button, Typography, Box, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CardActionArea, CardContent, Grid , AppBar, Toolbar, createTheme, ThemeProvider, CssBaseline
} from '@mui/material'
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";

const darkTheme = createTheme({
  palette:{
      mode: 'dark',
  },
})

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    fetch('/api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data))
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

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name')
      return
    }
    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const flashcardsDocRef = doc(collection(db, 'flashcards'), user.id)
    const docSnap = await getDoc(userDocRef)
    
    // Check if the document exists
    if (docSnap.exists()) { // docSnap.exists()
      const collections = docSnap.data()?.flashcards || []
      if (collections.find((f) => f.name === name)) {
        alert('You already have a collection with this name')
        return
      } else {
        collections.push({ name })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    } else {
      // If the document does not exist, initialize flashcards
      batch.set(userDocRef, { flashcards: [{ name }] })
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })
    await batch.commit()
    handleClose()
    router.push('/flashcards')
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/> 
      <Container maxWidth={{lg: "2000px", md:'800px' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}> 
              FlaCa </Typography>
            <SignedOut>
              <Button color = 'inherit'> Home </Button>
              <Button color="inherit" href="/sign-in"> Login</Button>
              <Button color="inherit" href="/sign-up"> Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <Button color = 'inherit' href='/'> Home </Button>
              <Button color ='inherit' href="/flashcards">Sets</Button>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Box sx={{
          my: 4,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <Paper sx={{ p: 4, width: '100%' }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter prompt to generate flashcards"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="success" onClick={handleSubmit} fullWidth>Submit</Button>
            
          </Paper>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button sx={{ mx: 3}} variant="contained" color="primary" onClick={() => router.push('/')}fullWidth>
                Home
              </Button>
              <Button variant="contained" color="primary" onClick={() => router.push('/flashcards')}fullWidth>Sets</Button>
            </Box>
        </Box>
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">
              Flashcards Preview
            </Typography>
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
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
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="secondary" onClick={handleOpen}>
                Save
              </Button>
            </Box>
          </Box>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard collection
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
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
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  )
}