# ChatGPT Page Assistant

## Overview
ChatGPT Page Assistant is a Chrome extension that allows you to ask ChatGPT questions about selected text on web pages. This tool enhances your browsing experience by providing quick access to ChatGPT's capabilities directly from any webpage.

## Installation

### Method 1: From GitHub
1. Clone the repository:
   ```
   git clone https://github.com/daishir0/ChatGPT_Page_Assistant
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the cloned repository folder
5. The extension should now be installed and visible in your Chrome toolbar

### Method 2: From Chrome Web Store
*(Note: This option will be available once the extension is published to the Chrome Web Store)*

## Usage
1. Select text on any webpage that you want to ask ChatGPT about
2. A "ChatGPT: [Prompt Title]" button will appear near your selection
3. You can either:
   - Click the button to use the current prompt template
   - Click the dropdown arrow to select a different prompt template
4. Enter your question about the selected text (or leave it empty to just send the selected text)
5. Submit your question, and ChatGPT will open in a new tab (or use an existing ChatGPT tab if one is already open)
6. Your question and the selected text will be automatically sent to ChatGPT using the selected prompt template

## Features
- Automatically captures selected text from web pages
- Multiple customizable prompt templates with easy switching
- Visual indication of which prompt template is currently selected
- Ability to set a default prompt template
- Option to send selected text without a question
- Import/export functionality for all settings (including prompt templates and temporary chat mode)
- Option to use temporary chat mode (conversations won't be saved)
- Efficiently reuses existing ChatGPT tabs instead of opening new ones
- Includes page information (title and URL) for better context

## Notes
- You need to have a ChatGPT account to use this extension
- The extension requires permissions to access the current tab and ChatGPT websites
- All processing of your selected text happens locally until you submit your question to ChatGPT
- For the best experience, ensure you're logged into ChatGPT before using the extension

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

# ChatGPT Page Assistant

## 概要
ChatGPT Page Assistantは、ウェブページ上で選択したテキストについてChatGPTに質問できるChrome拡張機能です。この拡張機能を使用すると、ブラウジング中に直接ChatGPTの機能にアクセスできるようになり、ウェブ閲覧体験が向上します。

## インストール方法

### 方法1: GitHubからのインストール
1. リポジトリをクローンします:
   ```
   git clone https://github.com/daishir0/ChatGPT_Page_Assistant
   ```
2. Chromeを開き、`chrome://extensions/`に移動します
3. 右上の「デベロッパーモード」スイッチをオンにします
4. 「パッケージ化されていない拡張機能を読み込む」をクリックし、クローンしたリポジトリフォルダを選択します
5. 拡張機能がインストールされ、Chromeツールバーに表示されるはずです

### 方法2: Chrome ウェブストアからのインストール
*(注: この選択肢は拡張機能がChrome ウェブストアに公開された後に利用可能になります)*

## 使い方
1. ChatGPTに質問したいテキストをウェブページ上で選択します
2. 選択した箇所の近くに「ChatGPT: [プロンプトタイトル]」ボタンが表示されます
3. 以下のいずれかの操作ができます：
   - ボタンをクリックして現在のプロンプトテンプレートを使用
   - ドロップダウン矢印をクリックして別のプロンプトテンプレートを選択
4. 選択したテキストについての質問を入力します（または空のままにして選択テキストのみを送信）
5. 質問を送信すると、ChatGPTが新しいタブで開きます（または既存のChatGPTタブがある場合はそれを使用します）
6. 質問と選択したテキストが、選択したプロンプトテンプレートを使用して自動的にChatGPTに送信されます

## 機能
- ウェブページから選択したテキストを自動的に取得
- 複数のカスタマイズ可能なプロンプトテンプレートと簡単な切り替え
- 現在選択されているプロンプトテンプレートの視覚的な表示
- デフォルトプロンプトテンプレートの設定機能
- 質問なしで選択テキストのみを送信する機能
- すべての設定（プロンプトテンプレートと一時チャットモードを含む）のインポート/エクスポート機能
- 一時チャットモードのオプション（会話が保存されません）
- 新しいタブを開く代わりに既存のChatGPTタブを効率的に再利用
- より良いコンテキストのためにページ情報（タイトルとURL）を含める

## 注意点
- この拡張機能を使用するにはChatGPTアカウントが必要です
- この拡張機能は現在のタブとChatGPTウェブサイトにアクセスするための権限が必要です
- 選択したテキストの処理は、質問をChatGPTに送信するまですべてローカルで行われます
- 最良の体験を得るために、拡張機能を使用する前にChatGPTにログインしていることを確認してください

## ライセンス
このプロジェクトはMITライセンスの下でライセンスされています。詳細はLICENSEファイルを参照してください。