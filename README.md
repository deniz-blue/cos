# CosQR

A tool for sharing social media usernames/contacts with others (potentially during large events such as furry or cosplay conventions) using QR codes.

## How it works

**Installation**

1. You must either [Install the app on Google Play Store](https://play.google.com/store/apps/details?id=lt.tsx.cos) or [use the web version](https://cos.tsx.lt)
2. Edit your details in the Profile page.

**Works without Internet\***

\* Except when the person scanning the QR code doesn't have the app, in which case they will fall back to the [web version](https://cos.tsx.lt)

**Scanned QR Codes Persist**

Any scanned QR codes will persist in your **History**. You can return to the History tab later.

**Scanning QR Codes**

You can either:
- Use the app's dedicated QR code scanner to scan many in quick succession or
- Use any app (such as your system camera) that can scan QR codes - which will ultimately open the app.

**Add Custom Notes**

While using the dedicated QR code scanner or viewing your history, you can add a custom note to attach relevant context about the person you have met.

---

## QR Code Data Model

The QR codes are versioned and always start with the app's domain: `https://cos.tsx.lt/`

The `hash` segment of the URL is used for the payload. The payload is prefixed with the format version (which is currently `0`).

The current payload has the following structure

```
Payload ::= Name "|" Socials "|" Details

Name    ::= Text
Details ::= Text
Socials ::= (Entry ( "," Entry )* )?
Entry   ::= Key ":" Value
Key     ::= Text
Value   ::= Text

Text    ::= Char*
Char    ::= [^|,:]
```

Example: `https://cos.tsx.lt/#0deniz|d:deniz.blue,b:deniz.blue|the%20meower`

Any `Text` in the payload is URL encoded (`|`, `:`, `,` are kept as-is)

Socials use a pre-defined dictionary format. The key is a one or two letter identifier and the value is the social media username/identifier.

| Key | Platform | Notes |
|---|---|---|
| `d` | Discord | Copies |
| `i` | Instagram |  |
| `tg` | Telegram |  |
| `s` | Signal |  |
| `m` | Matrix |  |
| `tt` | TikTok |  |
| `x` | X (or Twitter) |  |
| `b` | BlueSky |  |
| `t` | Tumblr |  |
| `l` | LinkTree |  |

