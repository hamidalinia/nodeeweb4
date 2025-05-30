import React, { useState, useEffect } from 'react';
import { getAllSidebarCategoriesData, MainUrl } from '#c/functions/index';

// Map of note keys and corresponding sound file names
const noteMap = {
  'A0': 'A0',
  'A_0': 'A_0',
  'B0': 'B0',
  'C1': 'C1',
  'C_1': 'C_1',
  'D1': 'D1',
  'D_1': 'D_1',
  'E1': 'E1',
  'F1': 'F1',
  'F_1': 'F_1',
  'G1': 'G1',
  'G_1': 'G_1',
  'A1': 'A1',
  'A_1': 'A_1',
  'B1': 'B1',
  'C2': 'C2',
  'C_2': 'C_2',
  'D2': 'D2',
  'D_2': 'D_2',
  'E2': 'E2',
  'F2': 'F2',
  'F_2': 'F_2',
  'G2': 'G2',
  'G_2': 'G_2',
  'A2': 'A2',
  'A_2': 'A_2',
  'B2': 'B2',
  'C3': 'C3',
  'C_3': 'C_3',
  'D3': 'D3',
  'D_3': 'D_3',
  'E3': 'E3',
  'F3': 'F3',
  'F_3': 'F_3',
  'G3': 'G3',
  'G_3': 'G_3',
  'A3': 'A3',
  'A_3': 'A_3',
  'B3': 'B3',
  'C4': 'C4',
  'C_4': 'C_4',
  'D4': 'D4',
  'D_4': 'D_4',
  'E4': 'E4',
  'F4': 'F4',
  'F_4': 'F_4',
  'G4': 'G4',
  'G_4': 'G_4',
  'A4': 'A4',
  'A_4': 'A_4',
  'B4': 'B4',
  'C5': 'C5',
  'C_5': 'C_5',
  'D5': 'D5',
  'D_5': 'D_5',
  'E5': 'E5',
  'F5': 'F5',
  'F_5': 'F_5',
  'G5': 'G5',
  'G_5': 'G_5',
  'A5': 'A5',
  'A_5': 'A_5',
  'B5': 'B5',
  'C6': 'C6',
  'C_6': 'C_6',
  'D6': 'D6',
  'D_6': 'D_6',
  'E6': 'E6',
  'F6': 'F6',
  'F_6': 'F_6',
  'G6': 'G6',
  'G_6': 'G_6',
  'A6': 'A6',
  'A_6': 'A_6',
  'B6': 'B6',
  'C7': 'C7',
  'C_7': 'C_7',
  'D7': 'D7',
  'D_7': 'D_7',
  'E7': 'E7',
  'F7': 'F7',
  'F_7': 'F_7',
  'G7': 'G7',
  'G_7': 'G_7',
  'A7': 'A7',
  'A_7': 'A_7',
  'B7': 'B7',
  'C8': 'C8',
};
const blackArray=[
  'A_0',
  'C_1',
  'D_1',
  'F_1',
  'G_1',
  'A_1',
  'C_2',
  'D_2',
  'F_2',
  'G_2',
  'A_2',
  'C_3',
  'D_3',
  'F_3',
  'G_3',
  'A_3',
  'C_4',
  'D_4',
  'F_4',
  'G_4',
  'A_4',
  'C_5',
  'D_5',
  'F_5',
  'G_5',
  'A_5',
  'C_6',
  'D_6',
  'F_6',
  'G_6',
  'A_6',
  'C_7',
  'D_7',
  'F_7',
  'G_7',
  'A_7',
]

const Piano = () => {
  const [isActive, setIsActive] = useState({});
  const [sounds, setSounds] = useState({});
  const [isLoaded, setIsLoaded] = useState(false); // Track if all sounds are loaded

  // Open an IndexedDB database to store audio files
  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('pianoSoundsDB', 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create an object store for sounds if it doesn't exist
        if (!db.objectStoreNames.contains('sounds')) {
          db.createObjectStore('sounds', { keyPath: 'note' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  // Save the sound Blob to IndexedDB
  const saveSoundToDB = (db, note, audioBlob) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('sounds', 'readwrite');
      const store = transaction.objectStore('sounds');
      store.put({ note, audioBlob });
      transaction.oncomplete = resolve;
      transaction.onerror = reject;
    });
  };

  // Load the sound Blob from IndexedDB
  const loadSoundFromDB = (db, note) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('sounds', 'readonly');
      const store = transaction.objectStore('sounds');
      const request = store.get(note);
      request.onsuccess = (event) => {
        resolve(event.target.result ? event.target.result.audioBlob : null);
      };
      request.onerror = reject;
    });
  };

  // Fetch the audio file as a Blob
  const fetchAudioAsBlob = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  // Preload sounds and store/load them from IndexedDB
  useEffect(() => {
    const preloadSounds = async () => {
      const db = await openDatabase();
      const soundFiles = {};

      for (const note in noteMap) {
        console.log("note",note)
        const cachedSound = await loadSoundFromDB(db, note);
        if (cachedSound) {
          // If sound is cached in IndexedDB, use it
          soundFiles[note] = cachedSound;
        } else {
          // If sound is not cached, fetch it and store it in IndexedDB
          const audioBlob = await fetchAudioAsBlob(`${MainUrl}/mp3tunes/${noteMap[note]}.mp3`);
          soundFiles[note] = audioBlob;
          await saveSoundToDB(db, note, audioBlob); // Save the sound to IndexedDB for future use
        }
      }

      setSounds(soundFiles);
      setIsLoaded(true); // Set isLoaded to true once all sounds are preloaded
    };

    preloadSounds();
  }, []);

  // Play sound based on the note passed
  const playSound = (note) => {
    if (sounds[note]) {
      const audio = new Audio(URL.createObjectURL(sounds[note])); // Create a new audio object from the Blob
      audio.play();
    }

    // Add visual feedback to the pressed key
    setIsActive((prevState) => ({
      ...prevState,
      [note]: true
    }));

    setTimeout(() => {
      setIsActive((prevState) => ({
        ...prevState,
        [note]: false
      }));
    }, 150); // Duration for key press effect
  };

  // Handle click event for piano keys
  const isBlack = (note) => {
    if(blackArray.indexOf(note)>-1){
      return 'black'
    }
    return 'white';
  }
  const handleClick = (note) => {

    playSound(note);
  };

  // Add event listener for key press to play piano keys using keyboard
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      if (noteMap[key]) {
        playSound(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isLoaded) {
    // Show a loading state if sounds are not loaded
    return <div className="loading">Loading Piano...</div>;
  }

  return (
    <div className="wrapper the-piano-wrapper">
      <ul className="piano-keys">
        {/* Static list of piano keys */}
        {Object.keys(noteMap).map((nm)=>{
          return <li
            className={`key ${isBlack(nm)} ${isActive[nm] ? 'active' : ''}`}
            data-key={nm}
            // onTouchStart={(e) => {
            //   e.preventDefault(); // Prevents the default touch behavior like scrolling
            //   handleClick(nm);
            // }}
            // onMouseDown={() => handleClick(nm)} // For desktop compatibility
            onClick={() => handleClick(nm)}
          >
              {isBlack(nm)!=='black' && <span>{nm}</span>}
          </li>
        })}


      </ul>
    </div>
  );
};

export default Piano;
