import {
  component$,
  useCleanup$,
  useCleanupQrl,
  useClientEffect$,
  useStore,
  useWatch$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { isServer } from "@builder.io/qwik/build";
import { Modal } from "~/components/modal";

export default component$(() => {
  // Local Storage store
  let localState = useStore(
    {
      mode: "To Thai",
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

  const thLayoutName = {
    Kedmanee: "เกษมณี",
    Pattachotee: "ปัตตะโชติ",
    Manoonchai: "มนูญชัย",
    Qwerty: "เควอร์ตี",
    Dvorak: "ดีโวแร็ค",
    Colemak: "โคล์เม็ค",
  };

  const thMode = {
    "To Thai": "เป็นไทย",
    "To English": "เป็นอังกฤษ",
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
  // Available modes
  const modes = ["To Thai", "To English", "Unshift"];

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

      if (localState.mode === "To Thai") {
        store.convertedText = store.text
          .split("")
          .map((char) => {
            // @ts-ignore
            return (
              layout.thai[localState.layout.thai as keyof typeof layout.thai].shift.concat(
                layout.thai[localState.layout.thai as keyof typeof layout.thai].normal
              )[
                layout.eng[localState.layout.eng as keyof typeof layout.eng].shift
                  .concat(layout.eng[localState.layout.eng as keyof typeof layout.eng].normal)
                  .indexOf(char)
              ] || char
            );
          })
          .join("");
      }

      if (localState.mode === "To English") {
        store.convertedText = store.text
          .split("")
          .map((char) => {
            // @ts-ignore
            return (
              layout.eng[localState.layout.eng as keyof typeof layout.eng].shift.concat(
                layout.eng[localState.layout.eng as keyof typeof layout.eng].normal
              )[
                layout.thai[localState.layout.thai as keyof typeof layout.thai].shift
                  .concat(layout.thai[localState.layout.thai as keyof typeof layout.thai].normal)
                  .indexOf(char)
              ] || char
            );
          })
          .join("");
      }

      if (localState.mode === "Unshift") {
        store.convertedText = store.text
          .split("")
          .map((char) => {
            // @ts-ignore
            return (
              layout.thai[localState.layout.thai as keyof typeof layout.thai].shift[
                layout.thai[localState.layout.thai as keyof typeof layout.thai].normal.indexOf(char)
              ] ||
              layout.thai[localState.layout.thai as keyof typeof layout.thai].normal[
                layout.thai[localState.layout.thai as keyof typeof layout.thai].shift.indexOf(char)
              ] ||
              char
            );
          })
          .join("");
      }
    },
    { eagerness: "load" }
  );

  return (
    <main className={`${localState.darkTheme ? "dark" : ""}`}>
      <div className="main-container">
        <div className="page-container">
          {/* Modal */}
          {localState.modal && (
            <Modal onClose={() => (localState.modal = false)} />
          )}

          {/* Web Title */}
          <div className="flex flex-col gap-2">
            <div className="title-container">
              <img src="/web.png" alt="W" className="title-img" />
              <span className="title-text">rongLang</span>
            </div>
            <h1 className="text-center text-gray-500">เว็บช่วยแปลงเวลาลืมสลับภาษา</h1>
          </div>

          {/* Top Bar Elements */}
          <div>
            <div className="absolute top-2 right-2">
              <button onClick$={() => (localState.modal = true)}>
                🤔คืออะไร
              </button>
            </div>
            <div className="absolute top-2 left-2">
              <div className="flex flex-row gap-4">
                <button
                  onClick$={() =>
                    (localState.darkTheme = !localState.darkTheme)
                  }
                >
                  {localState.darkTheme ? "😎" : "🌙"}
                </button>
                <button
                  onClick$={() =>
                    localState.lang === "en"
                      ? (localState.lang = "th")
                      : (localState.lang = "en")
                  }
                  class="emotes"
                >
                  {localState.lang === "en" ? "🇺🇸 (English)" : "🇹🇭 (ภาษาไทย)"}
                </button>
              </div>
            </div>
          </div>
          <div className="absolute top-2 left-[1/2] translate-x-[1/2]">
            <button onClick$={() => window.open("https://tinarskii.com")}>
              Website of <span className="underline">Tinarskii</span>
            </button>
          </div>

          {/* Bottom Bar Elements */}
          <div className="absolute bottom-4 right-4">
            <div className="flex flex-row gap-2">
              <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.wrong-lang.click%2F&quote=สำหรับใครที่ชอบลืมเปลี่ยนภาษาเวลาพิมพ์%20ใช้นี่สิ!">
                <i className="fa-brands fa-facebook text-2xl"></i>
              </a>
              <a href="https://twitter.com/intent/tweet/?text=สำหรับใครที่ชอบลืมเปลี่ยนภาษาเวลาพิมพ์%20ใช้นี่สิ!&hashtags=wronglang&via=tinarskii&related=&url=https://www.wrong-lang.click/">
                <i className="fa-brands fa-twitter text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Input Box */}
          <div className="input-container">
            <input
              type="text"
              className="input-box"
              placeholder={"ใส่ข้อความที่ต้องการที่นี่..."}
              value={store.text}
              onInput$={(e) =>
                (store.text = (e.target as HTMLInputElement)!.value)
              }
            />
            <input
              type="text"
              className="input-box"
              placeholder={"ข้อความที่แปลงแล้วจะปรากฎ..."}
              value={store.convertedText}
            />
            <input type="button"
                   className="w-full p-2 bg-transparent rounded-lg text-blue-500 border-2 border-blue-500 active:bg-blue-500 active:text-white duration-200"
                   value="คัดลอก" />
          </div>

          {/* Buttons */}
          <div className="buttons-container">
            <h1 className="buttons-label">
              {localState.lang === "en" ? "Thai Layout" : "แป้นพิมพ์ไทย"}
            </h1>
            <h1 className="buttons-label">
              {localState.lang === "en" ? "English Layout" : "แป้นพิมพ์อังกฤษ"}
            </h1>
            <h1 className="buttons-label">
              {localState.lang === "en" ? "Translataion Mode" : "โหมด"}
            </h1>
            {/* Thai Keyboard Layout */}
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

            {/* English Keyboard Layout */}
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

            {/* Translation Mode */}
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
          <div className="absolute left-0 bottom-0 m-4">
            <button
              className="text-white text-[16px] rounded-[100px] px-4 py-2 kofi bg-[#794bc4]"
              onClick$={() =>
                window.open("https://github.com/sponsors/tinarskii")
              }
            >
              ☕{localState.lang === "th" ? "สนับสนุน" : "Support Me"}
            </button>
          </div>
        </div>
        <div className="absolute bottom-2 left-[1/2] translate-x-[1/2]">
          <button onClick$={() => window.open("https://www.wrong-lang.click/#/wrongLang")}>Visit <span className="underline">SOLID VERSION</span></button>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "WrongLang - เว็บช่วยแปลงเวลาลืมสลับภาษา",
};
