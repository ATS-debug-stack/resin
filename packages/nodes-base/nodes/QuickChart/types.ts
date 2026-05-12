import type { IDataObject } from 'resin-workflow';

export interface IDataset {
	label?: string;
	data: string | IDataObject;
	backgroundColor?: string;
	borderColor?: string;
	color?: string;
	type?: string;
	fill?: boolean;
	pointStyle?: string;
}
