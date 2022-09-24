import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';

/**
 * The RouterHead component is placed inside the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/web.png" />

      <title>WrongLang - เว็บช่วยแปลงเวลาลืมสลับภาษา</title>
      <meta name="title" content="WrongLang - เว็บช่วยแปลงเวลาลืมสลับภาษา"/>
      <meta name="description" content="ลืมเปลี่ยนภาษาเวลาพิมพ์แชทงั้นหรอ? เว็บไซต์นี้สามารถช่วยคุณได้ ไม่ว่าจะใช้แป้นเกษมณี, มนูญชัย, Dvorak, Colemak, Qwerty ฯลฯ ก็สามารถใช้ได้!"/>
      <meta name="keywords" content="ลืมเปลี่ยนภาษา, เว็บแปลงภาษา, แปลงภาษา, ภาษา, เปลี่ยนภาษา, Qwerty, Colemak, Dvorak, Manoonchai, แป้นพิมพ์มนูญชัย, มนูญชัย, เกษมณี, ปัตตะโชติ, แป้นพิมพ์,"/>
      <meta name="author" content="Tinnaphat Somsang"/>

      <meta property="og:type" content="website"/>
      <meta property="og:url" content="https://www.wrong-lang.click/"/>
      <meta property="og:title" content="WrongLang - เว็บช่วยแปลงเวลาลืมสลับภาษา"/>
      <meta property="og:description" content="ลืมเปลี่ยนภาษาเวลาพิมพ์แชทงั้นหรอ? เว็บไซต์นี้สามารถช่วยคุณได้ ไม่ว่าจะใช้แป้นเกษมณี, มนูญชัย, Dvorak, Colemak, Qwerty ฯลฯ ก็สามารถใช้ได้!"/>
      <meta property="og:image" content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"/>

      <meta property="twitter:card" content="summary_large_image"/>
      <meta property="twitter:url" content="https://www.wrong-lang.click/"/>
      <meta property="twitter:title" content="WrongLang - เว็บช่วยแปลงเวลาลืมสลับภาษา"/>
      <meta property="twitter:description" content="ลืมเปลี่ยนภาษาเวลาพิมพ์แชทงั้นหรอ? เว็บไซต์นี้สามารถช่วยคุณได้ ไม่ว่าจะใช้แป้นเกษมณี, มนูญชัย, Dvorak, Colemak, Qwerty ฯลฯ ก็สามารถใช้ได้!"/>
      <meta property="twitter:image" content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"/>

      {head.meta.map((m) => (
        <meta {...m} />
      ))}

      {head.links.map((l) => (
        <link {...l} />
      ))}

      {head.styles.map((s) => (
        <style {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});
