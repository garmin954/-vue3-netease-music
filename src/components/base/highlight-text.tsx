import {defineComponent} from 'vue';
import '@/assets/style/components/highlight_text.scss';

export default defineComponent({
  name: 'HighlightText',
  props: ['text', 'highlightText'],
  setup(props) {

    const genHighlight = () => {
      if (!props.highlightText) {
        return <span>{props.text}</span>;
      }
      const highlightText = (props.highlightText || '').toString();
      const text = (props.text || '').toString();

      const titleToMatch = text.toLowerCase();
      const keyWord = highlightText.toLowerCase();
      const matchIndex = titleToMatch.indexOf(keyWord);
      const beforeStr = props.text.substr(0, matchIndex);
      const afterStr = props.text.substr(matchIndex + keyWord.length);
      const hitStr = props.text.substr(matchIndex, keyWord.length);
      const titleSpan =
        matchIndex > -1 ? (
          <span>
            {beforeStr}
            <span class='high-light-text'>{hitStr}</span>
            {afterStr}
          </span>
        ) : (
          props.text
        );
      return <span>{titleSpan}</span>;
    };
    return () => genHighlight();
  },
});
