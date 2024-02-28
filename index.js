// tabbableな要素は Micromodal.js を参考に実装
// https://github.com/ghosh/Micromodal/blob/master/lib/src/index.js
const FOCUSABLE_ELEMENTS = [
    "a[href]",
    "area[href]",
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    "select:not([disabled]):not([aria-hidden])",
    "textarea:not([disabled]):not([aria-hidden])",
    "button:not([disabled]):not([aria-hidden])",
    "iframe",
    "object",
    "embed",
    "[contenteditable]",
    '[tabindex]:not([tabindex^="-"])',
  ];

  const dialog = document.getElementById("dialog")
  const openTriggers = [
    ...document.querySelectorAll(`*[data-open-trigger="dialog"]`)
  ];
  const closeTriggers = [
    ...document.querySelectorAll(`*[data-close-trigger="dialog"]`)
  ];

  // ダイアログの中でtabbableな要素を取得
  const focusableElements = [
    ...dialog.querySelectorAll(FOCUSABLE_ELEMENTS.join(","))
  ];
  // ダイアログを開く時に、直前にフォーカスが当たっていた要素を格納する
  let beforeFocusedElement = null;
  
  // ダイアログを開く
  const handleDialogOpen = () => {
    if (!dialog.classList.contains("__hidden")) return;
  
    dialog.classList.remove("__hidden");
    // ダイアログを開く直前のフォーカスの取得
    beforeFocusedElement = document.activeElement;
    // ダイアログ内の最初のtabbableな要素にフォーカスをあてる
    focusableElements[0].focus();

    // スクロールと選択操作の処理を追加
    bgScrollBehavior("fix");
    noSelectContents(true);
  };
  
  // ダイアログを閉じる
  const handleDialogClose = () => {
    if (dialog.classList.contains("__hidden")) return;
  
    dialog.classList.add("__hidden");
    // ダイアログを開く時に、直前にフォーカスが当たっていた要素にフォーカスを戻す
    beforeFocusedElement.focus();
    beforeFocusedElement = null;

    // スクロールと選択操作の処理を追加
    bgScrollBehavior("scroll");
    noSelectContents(false);
  };

  openTriggers.forEach((trigger) => {
    trigger.addEventListener("click", handleDialogOpen)
  })

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", handleDialogClose)
  })

const handleKeydownDiaogContainer = (e) => {
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (e.code === "Tab") {
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                // ダイアログ内で最初のtabableの要素の時、最後のtabableの要素にフォーカスを移す
                lastFocusableElement.focus();
            }
            } else {
            // Tab
            if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                // ダイアログ内で最後のtabableの要素の時、最初のtabableの要素にフォーカスを移す
                firstFocusableElement.focus();
            }
        }
        // Escapeの押下でダイアログを閉じる
        if (e.code === "Escape") {
            handleDialogClose();
        }
    }
};
  
dialog.addEventListener("keydown", handleKeydownDiaogContainer);

const bgScrollBehavior = (state) => {
    const isFixed = state === "fix";
  
    if (isFixed) {
      // スクロールを止める処理
      // .fixedのスタイルを用意
      const scrollY = document.documentElement.scrollTop;
      document.body.classList.add("fixed");
      document.documentElement.style.setProperty(
        "--scroll-y",
        `${scrollY * -1}px`
      );
    } else {
      // スクロール停止を解除する処理
      const scrollY = parseInt(
        document.documentElement.style.getPropertyValue("--scroll-y") || "0"
      );
      document.body.classList.remove("fixed");
      window.scrollTo(0, scrollY * -1);
    }
  };
  
  const noSelectContents = (bool) => {
    // .user-select-noneのスタイルを用意
    if (bool) {
      main.classList.add("user-select-none");
    } else {
      main.classList.remove("user-select-none");
    }
  };