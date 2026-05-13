export {
	NoMatchFoundError,
	MultipleMatchesError,
	InvalidLineNumberError,
	InvalidViewRangeError,
	InvalidPathError,
	FileExistsError,
	FileNotFoundError,
	BatchReplacementError,
} from '@resin/ai-utilities/text-editor';

export type {
	ViewCommand,
	CreateCommand,
	StrReplaceCommand,
	InsertCommand,
	TextEditorCommand,
	TextEditorToolCall,
	TextEditorResult,
	StrReplacement,
	BatchReplaceResult,
} from '@resin/ai-utilities/text-editor';
