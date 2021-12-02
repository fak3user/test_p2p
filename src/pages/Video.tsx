import React, { useEffect } from 'react';

async function getVideoStream() {
  return new Promise((resolve, reject) => {
     navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => resolve(stream))
  })
}

interface IVideoProps {
  onFetchingStream: (stream: any) => void;
  remoteStream: any;
}
function Video(props: IVideoProps) {
  const { onFetchingStream, remoteStream } = props;

  useEffect(() => {
    getVideoStream().then((stream) => {
      const video: any = document.querySelector('#self')
      video.srcObject = stream
      onFetchingStream(stream)
    })
  }, [])

  useEffect(() => {
    if (remoteStream !== null) {
      const video: any = document.querySelector('#remote')
      video.srcObject = remoteStream
    }
  }, [remoteStream])

  return <div className="video">
    <video id='self' autoPlay />
    <video id='remote' autoPlay />
  </ div>
}

export default Video