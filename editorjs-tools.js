import Paragraph from "@editorjs/paragraph"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Link from "@editorjs/link"
import FootnotesTune from "@editorjs/footnotes"

export const EDITOR_JS_TOOLS = {
    paragraph: {
        class: Paragraph,
        inlineToolbar: true,
        tunes: ['footnotes']
    },
    header: Header,
    link: Link,
    list: List,
    footnotes: {
        class: FootnotesTune,
        config: {
            placeholder: 'Your placeholder for footnotes popover',
            shortcut: 'CTRL+SHIFT+F',
        }
    }
};