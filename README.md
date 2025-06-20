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
1. Visit the Chrome Web Store page: [ChatGPT Page Assistant](https://chromewebstore.google.com/detail/chatgpt-page-assistant/boeeliegofkbpnkklggbfglkhgmnnpej)
2. Click "Add to Chrome" button
3. Confirm the installation by clicking "Add extension" in the popup dialog
4. The extension will be automatically installed and added to your Chrome toolbar

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
- Responsive UI with proper CSS box model handling for consistent display across different websites

## Privacy
- All processing of your selected text happens locally until you submit your question to ChatGPT
- The extension only processes essential information: selected text, your questions, page title/URL, and your settings
- All settings and preferences are stored locally in your browser
- No data is sent to any third-party servers other than OpenAI's ChatGPT service when you submit a question

## Notes
- You need to have a ChatGPT account to use this extension
- The extension requires permissions to access the current tab and ChatGPT websites
- For the best experience, ensure you're logged into ChatGPT before using the extension

## Recent Updates
- Fixed CSS issue where the question input field could overflow its container in certain situations
- Improved UI responsiveness and consistency across different websites
- Enhanced prompt template management with better visual feedback

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
1. Chrome ウェブストアのページにアクセスします: [ChatGPT Page Assistant](https://chromewebstore.google.com/detail/chatgpt-page-assistant/boeeliegofkbpnkklggbfglkhgmnnpej)
2. 「Chromeに追加」ボタンをクリックします
3. ポップアップダイアログで「拡張機能を追加」をクリックして、インストールを確認します
4. 拡張機能が自動的にインストールされ、Chromeツールバーに追加されます

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
- 一貫した表示のためのレスポンシブUIとCSSボックスモデルの適切な処理

## プライバシー
- 選択したテキストの処理は、質問をChatGPTに送信するまですべてローカルで行われます
- この拡張機能は必要な情報のみを処理します：選択テキスト、質問、ページタイトル/URL、および設定
- すべての設定と環境設定はブラウザにローカルに保存されます
- 質問を送信する際にOpenAIのChatGPTサービス以外のサードパーティサーバーにデータが送信されることはありません

## 注意点
- この拡張機能を使用するにはChatGPTアカウントが必要です
- この拡張機能は現在のタブとChatGPTウェブサイトにアクセスするための権限が必要です
- 最良の体験を得るために、拡張機能を使用する前にChatGPTにログインしていることを確認してください

## 最近の更新
- 特定の状況で質問入力フィールドがコンテナからはみ出す可能性があるCSSの問題を修正
- 異なるウェブサイト間でのUIの応答性と一貫性を向上
- より良い視覚的フィードバックによるプロンプトテンプレート管理の強化

## ライセンス
このプロジェクトはMITライセンスの下でライセンスされています。詳細はLICENSEファイルを参照してください。