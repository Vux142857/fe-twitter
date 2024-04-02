'use client'
import { memo, useEffect, useRef, useState } from 'react';
import {
    isHLSProvider,
    MediaPlayer,
    MediaProvider,
    type MediaCanPlayDetail,
    type MediaCanPlayEvent,
    type MediaPlayerInstance,
    type MediaProviderAdapter,
    type MediaProviderChangeEvent,
} from '@vidstack/react';
import {
    DefaultAudioLayout,
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

interface PlayerProps {
    url: string,
    username: string
}

const Player = ({ url, username }) => {
    let player = useRef<MediaPlayerInstance>(null),
        [src, setSrc] = useState('');

    useEffect(() => {
        // Initialize src.
        changeSource('video', url);

        // Subscribe to state updates.
        return player.current!.subscribe(({ paused, viewType }) => {
            // console.log('is paused?', '->', paused);
            // console.log('is audio view?', '->', viewType === 'audio');
        });
    }, []);

    function onProviderChange(
        provider: MediaProviderAdapter | null,
        nativeEvent: MediaProviderChangeEvent,
    ) {
        // We can configure provider's here.
        if (isHLSProvider(provider)) {
            provider.config = {};
        }
    }

    // We can listen for the `can-play` event to be notified when the player is ready.
    function onCanPlay(detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) {
        // ...
    }

    function changeSource(type: string, url?: string) {
        const muxPlaybackId = 'VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU';
        switch (type) {
            // case 'audio':
            //   setSrc('https://media-files.vidstack.io/sprite-fight/audio.mp3');
            //   break;
            case 'video':
                setSrc((url) ? url : `https://stream.mux.com/${muxPlaybackId}.m3u8`);
                break;
            case 'hls':
                setSrc((url) ? url : `https://stream.mux.com/${muxPlaybackId}.m3u8`);
                break;
            // case 'youtube':
            //   setSrc('youtube/_cMxraX_5RE');
            //   break;
            // case 'vimeo':
            //   setSrc('vimeo/640499893');
            //   break;
        }
    }

    return (
        <div className='h-80 flex justify-center items-center'>
            <MediaPlayer
                className="player"
                title={username}
                src={src}
                aspectRatio='16:9'
                crossorigin
                playsinline
                onProviderChange={onProviderChange}
                onCanPlay={onCanPlay}
                ref={player}
            >
                <MediaProvider>
                    {/* <Poster
            className="vds-poster"
            src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
            alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
          /> */}
                </MediaProvider>

                {/* Layouts */}
                <DefaultAudioLayout icons={defaultLayoutIcons} />
                <DefaultVideoLayout
                    icons={defaultLayoutIcons}
                // thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
                />
            </MediaPlayer>

            {/* <div className="src-buttons">
        <button onClick={() => changeSource('audio')}>Audio</button>
        <button onClick={() => changeSource('video')}>Video</button>
        <button onClick={() => changeSource('hls')}>HLS</button>
        <button onClick={() => changeSource('youtube')}>YouTube</button>
        <button onClick={() => changeSource('vimeo')}>Vimeo</button>
      </div> */}
        </div>
    );
}

export default memo(Player);
