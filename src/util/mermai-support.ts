// learn from https://github.com/mjbvz/vscode-markdown-mermaid
import * as mdItContainer from "markdown-it-container";

export const mermaiSupport = (md) => {
  const pluginKeyword = "mermaid";
  const tokenTypeInline = "inline";
  const ttContainerOpen = "container_" + pluginKeyword + "_open";
  const ttContainerClose = "container_" + pluginKeyword + "_close";
  const empty = [];
  md.use(mdItContainer, pluginKeyword, {
    anyClass: true,
    validate: (info) => {
      return info.trim() === pluginKeyword;
    },

    render: (tokens, idx) => {
      const token = tokens[idx];

      var src = "";
      if (token.type === ttContainerOpen) {
        for (var i = idx + 1; i < tokens.length; i++) {
          const value = tokens[i];
          if (value === undefined || value.type === ttContainerClose) {
            break;
          }
          src += value.content;
          if (value.block && value.nesting <= 0) {
            src += "\n";
          }
          value.tag = "";
          value.type = tokenTypeInline;
          value.content = "";
          value.children = empty;
        }
      }

      if (token.nesting === 1) {
        return `<div class="${pluginKeyword}">${preProcess(src)}`;
      } else {
        return "</div>";
      }
    },
  });

  const highlight = md.options.highlight;
  md.options.highlight = (code, lang) => {
    if (lang && lang.match(/\bmermaid\b/i)) {
      return `<pre style="all:unset;"><div class="${pluginKeyword}">${preProcess(
        code
      )}</div></pre>`;
    }
    return highlight(code, lang);
  };
  return md;
};

const preProcess = (source) =>
  source.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
