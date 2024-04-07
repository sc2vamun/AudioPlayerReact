import './navbar.css'
import shuffle from '../assets/icons/shuffle.png'
import repeat from '../assets/icons/repeat.png'
import shuffleOff from '../assets/icons/shuffleoff.png'
import repeatOff from '../assets/icons/repeatoff.png'
import play from '../assets/icons/play-button.png'
import pause from '../assets/icons/pause.png'
import next from '../assets/icons/next-button.png'
import prev from '../assets/icons/previous.png'
import { useState, useRef, useEffect } from 'react'
import { Track } from './Track'
export const Navbar = () => {
    const playlist = 
        [
            {
                id: '0',
                src: '/music/iowa_-_ulybaysya.mp3',
                name: 'Улыбайся',
                singer: 'Iowa'
            },
            {
                id: '1',
                src: '/music/ANNA ASTI-По барам.mp3',
                name: 'По барам',
                singer: 'Anna Asti'
            },
            {
                id: '2',
                src: '/music/CHEPIKK-Чёрная Волга [muzfa.net].mp3',
                name: 'Черная Волга',
                singer: 'Chepikk'
            },
            {
                id: '3',
                src: '/music/hi-fi_-_sedmoy-lepestok (1).mp3',
                name: 'Седьмой Лепесток',
                singer: 'Hi-Fi'
            },
            {
                id: '4',
                src: '/music/amirchik_-_eta-lyubov.mp3',
                name: 'Эта любовь',
                singer: 'Амирчик'
            },
        ]
    
    const [track, setTrack] = useState(playlist[0])
    const [icon, setIcon] = useState(play);
    const audioEl = useRef<HTMLAudioElement>(null);
    const [duration, setDuration] = useState(0);
    const [time, setTime] = useState('0');
    const [progress, setProgress] = useState(10);
    const [mode1, setMode1] = useState('norepeat');
    const [mode2, setMode2] = useState('noshuffle');
    const [shuffleIcon, setShuffleIcon] = useState(shuffleOff);
    const [repeatIcon, setRepeatIcon] = useState(repeatOff);
    const onPlayHandler = () => {
        if (icon == play) {
            audioEl.current?.play();
            setIcon(pause);
        } else {
            audioEl.current?.pause();
            setIcon(play);
        }
    }

    const autoPlay = () => {
        audioEl.current?.addEventListener('loadedmetadata', () => {
            if (icon == pause) audioEl.current?.play();
          }, { once: true });
    }

    const onPrevTrack = () => {
        const prevId = parseInt(track.id)-1;
        if (prevId >= 0) {
            setTrack(playlist[prevId]);
            autoPlay();
        }
    }
    const onEndedHandler = () => {
        mode1 =='norepeat' ? onNextTrack(): audioEl.current?.play();
        
    }
    const onNextTrack = ()=> {
        let nextId;
        mode2 == 'shuffle' ? nextId=(Math.floor(Math.random()*5)): nextId = parseInt(track.id)+1;
        if (nextId <= 4) {
            setTrack(playlist[nextId]);
            autoPlay();
       }
    }
   
    const onTrack = (index: number)=> {
        setTrack(playlist[index]);
        autoPlay();
    }

    useEffect(() => {
        if (audioEl.current) {
            audioEl.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        }
        return () => {
            if (audioEl.current) {
                audioEl.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [audioEl]);

    useEffect(() => {
        if (audioEl.current) {
            audioEl.current?.addEventListener('timeupdate', ()=>{
                const totalTimeInSeconds = audioEl.current?.currentTime? Math.round(audioEl.current?.currentTime) : 0;
                const timeInMinutes = Math.floor(totalTimeInSeconds/60);
                const timeInSeconds = totalTimeInSeconds - timeInMinutes*60;
                const timeCalc = timeInMinutes + '.' + ((timeInSeconds<10)? '0'+ timeInSeconds: timeInSeconds.toString());
                setTime(timeCalc)
                setProgress(audioEl.current?.currentTime? (audioEl.current?.currentTime /audioEl.current.duration)*100 : 0)
            })
        }

    }, [audioEl]);
   
    const handleLoadedMetadata = () => {
        if (audioEl.current) {
            const curDuration = parseFloat(Math.floor(audioEl.current?.duration!/60)+'.'+ (Math.round(audioEl.current?.duration! - Math.floor(audioEl.current?.duration!/60)*60)));
            setDuration(curDuration);
        }
    };
   const barClickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target as HTMLElement;
    const a = (e.pageX - element.offsetLeft)/60*100; 
    audioEl.current? audioEl.current.currentTime = (audioEl.current?.duration*a/100): 0;
    
   }

   const onRepeatHandler = () => {
    repeatIcon==repeat ? setRepeatIcon(repeatOff) : setRepeatIcon(repeat);
    mode1 == 'repeat' ? setMode1('norepeat') : setMode1('repeat');

   }

   const onShuffleHandler = () => {
    shuffleIcon==shuffle ? setShuffleIcon(shuffleOff) : setShuffleIcon(shuffle);
    mode2 == 'shuffle' ? setMode2('noshuffle') : setMode2('shuffle');
   }

    return (    
        <>
        <audio controls  src={track.src} ref={audioEl} onEnded={onEndedHandler} style= {{display: 'none'}}></audio>
        <div className="display"><p>NOW PLAYING: {track.singer} | {track.name} | {duration}</p></div>
        <div className="navbar">
            <img src={prev} alt="prev" onClick={()=>onPrevTrack()}/>
            <img src={icon} alt="play/pause" onClick={()=>onPlayHandler()}/>
            <img src={next} alt="next" onClick={()=>onNextTrack()}/>
            <div>{time}/{duration}</div>
            <div className='bar' onClick={(e)=>barClickHandler(e)}> <div className="progress" style={{width: `${progress}%`}}></div></div>
            <img src={repeatIcon} alt="repeat" onClick={onRepeatHandler}/>
            <img src={shuffleIcon} alt="shuffle" onClick={onShuffleHandler}/>
        </div>
        
            <div className='playlist'>
            {
                playlist.map((item, index)=> (
                    <Track
                        key={index}
                        name={item.name}
                        singer={item.singer}
                        onClick = {() => onTrack(index)}
                    />
                ))
            }
            </div>
            
        </>
    )
}