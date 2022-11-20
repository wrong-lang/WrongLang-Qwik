import {
  component$,
  useClientEffect$,
  useStore,
  useWatch$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { isServer } from "@builder.io/qwik/build";
import { Modal } from "~/components/modal";
import { WrongLang } from "wl.js";

export default component$(() => {
  const wrongLang = new WrongLang({});
  // Local Storage store
  let localState = useStore(
    {
      mode: "Swap language",
      layout: {
        thai: "Kedmanee",
        eng: "Qwerty",
      },
      modal: false,
      darkTheme: false,
      lang: "th",
      isLoaded: false,
    },
    { recursive: true }
  );

  // Available keyboard layout
  const layout = {
    // Thai keyboard layout
    thai: {
      Kedmanee: {
        normal: "_ๅ/-ภถุึคตจขชๆไำพะัีรนยบลฃฟหกดเ้่าสวงผปแอิืทมใฝ".split(""),
        shift: '%+๑๒๓๔ู฿๕๖๗๘๙๐"ฎฑธํ๊ณฯญฐ,ฅฤฆฏโฌ็๋ษศซ.()ฉฮฺ์?ฒฬฦ'.split(""),
      },
      Pattachotee: {
        normal: "_=๒๓๔๕ู๗๘๙๐๑๖็ตยอร่ดมวแใฌ้ทงกัีานเไขบปลหิคสะจพ".split(""),
        shift: '฿+"/,?ุ_.()-%๊ฤๆญษึฝซถฒฯฦํ๋ธำณ์ืผชโฆฑฎฏฐภัศฮฟฉฬ'.split(""),
      },
      Manoonchai: {
        normal: "`1234567890-=ใตหลสปักิบ็ฬฯงเรนมอา่้วืุไทยจคีดะู".split(""),
        shift: '~!@#$%^&*()_+ฒฏซญฟฉึธฐฎฆฑฌษถแชพผำขโภ"ฤฝๆณ๊๋์ศฮ?'.split(""),
      },
    },
    // English keyboard layout
    eng: {
      Qwerty: {
        normal: "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,.".split(""),
        shift: '~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?'.split(""),
      },
      Dvorak: {
        normal: "1234567890[]',.pyfgcrl/=\\aoeuidhtns-;qjkxbmwvz".split(""),
        shift: '!@#$%^&*(){}"<>PYFGCRL?+|AOEUIDHTNS_:QJKXBMWVZ'.split(""),
      },
      Colemak: {
        normal: "1234567890-=qwfpgjluy;[]\\arstdhneio'zxcvbkm,./".split(""),
        shift: '!@#$%^&*()_+QWFGPJLUY:{}|ARSTDHNEIO"ZXCVBKM<>?'.split(""),
      },
    },
  };

  const thLayoutName = {
    Kedmanee: "เกษมณี",
    Pattachotee: "ปัตตะโชติ",
    Manoonchai: "มนูญชัย",
    Qwerty: "เควอร์ตี",
    Dvorak: "ดีโวแร็ค",
    Colemak: "โคล์เม็ค",
  };

  const thMode = {
    "Swap language": "สลับภาษา",
    Unshift: "ยกเลิกตรึงอักษร",
  };

  useClientEffect$(async () => {
    if (localStorage["wrong-lang-settings"] && !localState.isLoaded) {
      let parseStore = JSON.parse(localStorage["wrong-lang-settings"]);
      localState.layout = parseStore.layout;
      localState.darkTheme = parseStore.darkTheme;
      localState.mode = parseStore.mode;
      localState.modal = parseStore.modal;
      localState.lang = parseStore.lang;
      localState.isLoaded = true;
    }
  });

  // Store text
  const store = useStore(
    {
      text: "",
      convertedText: "",
    },
    { recursive: true }
  );

  // Available modes
  const modes = ["Swap language", "Unshift"];

  useWatch$(
    ({ track }) => {
      track(store, "text");
      track(localState, "layout");
      track(localState, "mode");
      track(localState, "darkTheme");
      track(localState, "lang");

      if (!isServer) {
        if (localStorage && localState.isLoaded) {
          localStorage["wrong-lang-settings"] = JSON.stringify(localState);
        }
      }

      if (localState.mode === "Swap language") {
        store.convertedText = wrongLang.languageSwap({
          layout: {
            from: localState.layout.eng,
            to: localState.layout.thai,
          },
          text: store.text,
        })
      }

      if (localState.mode === "Unshift") {
        store.convertedText = wrongLang.unshift({
          layout: localState.layout.thai,
          text: store.text,
        });
      }
    },
    { eagerness: "load" }
  );

  return (
    <main className={`${localState.darkTheme ? "dark" : ""}`}>
      {/* Top Bar Elements */}
      <div>
        <div className="absolute top-2 right-2">
          <button
            onClick$={() => (localState.modal = true)}
            class="emotes"
          >
            🤔คืออะไร
          </button>
        </div>
        <div className="absolute top-2 left-2">
          <div className="flex flex-row gap-4">
            <button
              onClick$={() =>
                (localState.darkTheme = !localState.darkTheme)
              }
              className="emotes"
            >
              {localState.darkTheme ? "😎" : "🌙"}
            </button>
            <button
              onClick$={() =>
                localState.lang === "en"
                  ? (localState.lang = "th")
                  : (localState.lang = "en")
              }
              className="emotes"
            >
              {localState.lang === "th" ? "🇺🇸" : "🇹🇭"}
            </button>
          </div>
        </div>
      </div>

      <div className="main-container">
        <div className="page-container">
          {/* Wordmark */}
          <div className="absolute top-2 left-[1/2] translate-x-[1/2]">
            <button onClick$={() => window.open("https://tinarskii.com")}>
              Website of <span className="underline">Tinarskii</span>
            </button>
          </div>
          {/* Modal */}
          {localState.modal && (
            <Modal onClose={() => (localState.modal = false)} />
          )}

          {/* Web Title */}
          <div className="header-container">
            <div className="title-container">
              <img src="/web.png" alt="W" className="title-img" />
              <span className="title-text">rongLang</span>
            </div>
            <h1 className="text-center text-gray-500">เว็บช่วยแปลงเวลาลืมสลับภาษา</h1>
          </div>

          {/* Input Box */}
          <div className="input-container">
            {/* Input Box */}
            <input
              type="text"
              className="input-box"
              placeholder={localState.lang === "th" ? "ใส่ข้อความที่ต้องการที่นี่..." : "Type your text here..."}
              value={store.text}
              onInput$={(e) =>
                (store.text = (e.target as HTMLInputElement)!.value)
              }
            />
            {/* Converted Box */}
            <input
              type="text"
              className="input-box"
              placeholder={localState.lang === "th" ? "ข้อความที่แปลงแล้วจะปรากฎ..." : "Converted text will appear here..."}
              value={store.convertedText}
            />
            {/* Copy Button */}
            <input type="button"
                   className="w-full p-2 bg-transparent rounded-lg text-blue-500 border-2 border-blue-500 active:bg-blue-500 active:text-white duration-200"
                   value={localState.lang === "th" ? "คัดลอก" : "Copy"}
                   onClick$={() => {
                     navigator.clipboard.writeText(store.convertedText);
                     alert(localState.lang === "th" ? "คัดลอกเรียบร้อยแล้ว!" : "Copied!");
                   }}
            />
          </div>

          {/* Label */}
          <div className="buttons-container">
            <h1 className="buttons-label">
              {localState.lang === "en" ? "Thai Layout" : "แป้นพิมพ์ไทย"}
            </h1>
            <h1 className="buttons-label">
              {localState.lang === "en" ? "English Layout" : "แป้นพิมพ์อังกฤษ"}
            </h1>
            <h1 className="buttons-label">
              {localState.lang === "en" ? "Translataion Mode" : "โหมดการแปลภาษา"}
            </h1>

            {/* Thai Keyboard Layout Buttons */}
            <div className="buttons-group">
              {Object.keys(layout.thai).map((layout) => {
                return (
                  <button
                    className={`px-4 py-2 text-white rounded-lg basis-full duration-200 ${
                      localState.layout.thai === layout
                        ? "bg-[#168732]"
                        : "bg-blue-700"
                    }`}
                    onClick$={() => (localState.layout.thai = layout)}
                  >
                    {localState.lang === "th"
                      ? thLayoutName[layout as keyof typeof thLayoutName]
                      : layout}
                  </button>
                );
              })}
            </div>

            {/* English Keyboard Layout Buttons */}
            <div className="buttons-group">
              {Object.keys(layout.eng).map((layout) => {
                return (
                  <button
                    className={`px-4 py-2 text-white rounded-lg basis-full duration-200 ${
                      localState.layout.eng === layout
                        ? "bg-[#168732]"
                        : "bg-blue-700"
                    }`}
                    onClick$={() => (localState.layout.eng = layout)}
                  >
                    {localState.lang === "th"
                      ? thLayoutName[layout as keyof typeof thLayoutName]
                      : layout}
                  </button>
                );
              })}
            </div>

            {/* Translation Mode Buttons */}
            <div className="buttons-group">
              {modes.map((mode) => {
                return (
                  <button
                    className={`px-4 py-2 text-white rounded-lg basis-full duration-200 ${
                      localState.mode === mode ? "bg-[#168732]" : "bg-blue-700"
                    }`}
                    onClick$={() => (localState.mode = mode)}
                  >
                    {localState.lang === "th"
                      ? thMode[mode as keyof typeof thMode]
                      : mode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Support button */}
          <div className="absolute left-0 bottom-0 m-4">
            <button
              className="text-white text-[16px] rounded-[100px] px-4 py-2 kofi bg-[#794bc4]"
              onClick$={() =>
                window.open("https://ko-fi.com/tinarskii")
              }
            >
              ☕{localState.lang === "th" ? "สนับสนุน" : "Support Me"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "WrongLang - เว็บช่วยแปลงเวลาลืมสลับภาษา",
};
