import React from 'react'
import { TConnectionType } from '../App'

interface IConnectFormProps {
	peerId: string;
	remotePeerId: string;
	connectionType: TConnectionType;
	isButtonDisabled: boolean;
	onRemotePeerChange: (peerId: string) => void;
	onConnectionTypeChange: (connectionType: TConnectionType) => void;
	onConnectClick: () => void; 
}

function ConnectForm(props: IConnectFormProps) {
	const { peerId, remotePeerId, connectionType, onConnectionTypeChange, onRemotePeerChange, onConnectClick, isButtonDisabled } = props

	return <div className='connect-form'>
		<p>my id is <strong>{peerId}</strong></p>
		<div className='row'>
			<input placeholder='enter remote id' type="text" value={remotePeerId} onChange={(e: any) => onRemotePeerChange(e.target.value)} />
			<button disabled={isButtonDisabled} onClick={onConnectClick}>connect</ button>
		</div>
		<div className='col'>
			<div className='radio-wrapper'>
				<input onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConnectionTypeChange(e.target.value as TConnectionType)} value='text' name='chatType' type='radio' id='label-text' checked={connectionType === 'text'}/>
				<label htmlFor="label-text">text</label>
			</div>
			<div className='radio-wrapper'>
				<input onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConnectionTypeChange(e.target.value as TConnectionType)} value='video' name='chatType' type='radio' id='label-video' checked={connectionType === 'video'} />
				<label htmlFor="label-video">video</label>
			</div>
		</div>
	</ div>
}

export default ConnectForm