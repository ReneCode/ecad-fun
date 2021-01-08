const svgData: any = {
  edit: {
    stroke: "#eee",
    strokeLinejoin: "round",
    fill: "#eee",
    viewBox: "0 0 29 29",
    svg: [
      {
        type: "path",
        d:
          "M10.111 23.3388L24.2531 9.1967L19.3034 4.24695L5.16122 18.3891L10.111 23.3388Z",
      },
      {
        type: "path",
        d:
          "M25.6673 7.78249L20.7176 2.83274L22.1318 1.41853L27.0815 6.36827L25.6673 7.78249Z",
      },
      {
        type: "path",
        d: "M9.05031 24.3995L4.10056 19.4497L3.39345 25.1066L9.05031 24.3995Z",
      },
    ],
  },
  connectionpoint: {
    viewBox: "-2 -2 28 49",
    fill: "#eee",

    svg: [
      {
        type: "path",
        d:
          "M24 33C24 39.6274 18.6274 45 12 45C5.37258 45 0 39.6274 0 33C0 26.3726 5.37258 21 12 21C18.6274 21 24 26.3726 24 33ZM7.06581 33C7.06581 35.7251 9.27492 37.9342 12 37.9342C14.7251 37.9342 16.875 35.7251 16.875 33C16.875 30.2749 14.7251 28.0658 12 28.0658C9.27492 28.0658 7.06581 30.2749 7.06581 33Z",
      },
      {
        type: "path",
        d: "M8 0H16V24H8V0Z",
      },
    ],
  },
  text: {
    viewBox: "0 0 12 12",
    stroke: "#eee",
    svg: [
      {
        type: "path",
        d: "M3 11H6M9 11H6M6 11V1M6 1H1M6 1H11M11 0.5V3M1 0.5V3",
      },
    ],
  },
  undo: {
    viewBox: "0 0 90 88",
    stroke: "#eee",
    fill: "none",
    svg: [
      {
        type: "path",
        d: "M82.5 80.5C82.5 30.5 77 21.5 12 21.5",
        strokeWidth: 10,
      },
      { type: "path", d: "M41.5 1L1.5 21L41.5 41V1Z", fill: "#eee" },
    ],
  },
  redo: {
    viewBox: "0 0 90 88",
    stroke: "#eee",
    fill: "none",
    svg: [
      {
        type: "path",
        d: "M5 80.5C5 30.5 10.5 21.5 75.5 21.5",
        strokeWidth: 10,
      },
      { type: "path", d: "M46 1L86 21L46 41V1Z", fill: "#eee" },
    ],
  },
  zoomin: {
    viewBox: "0 0 115 115",
    stroke: "#eee",
    fill: "none",
    svg: [
      {
        type: "circle",
        cx: 48.5,
        cy: 48.5,
        r: 44.5,
        strokeWidth: 8,
      },
      {
        type: "line",
        x1: 86.8411,
        y1: 79.3907,
        x2: 110.841,
        y2: 99.3907,
        strokeWidth: 12,
      },
      {
        type: "path",
        d: "M22 50L75 50",
        strokeWidth: 12,
      },
      { type: "path", d: "M48.5 76.5L48.5 23.5", strokeWidth: 12 },
    ],
  },

  zoomout: {
    viewBox: "0 0 115 115",
    stroke: "#eee",
    fill: "none",
    svg: [
      {
        type: "circle",
        cx: 48.5,
        cy: 48.5,
        r: 44.5,
        strokeWidth: 8,
      },
      {
        type: "line",
        x1: 86.8411,
        y1: 79.3907,
        x2: 110.841,
        y2: 99.3907,
        strokeWidth: 12,
      },
      {
        type: "line",
        x1: 22,
        y1: 50,
        x2: 75,
        y2: 50,
        strokeWidth: 12,
      },
    ],
  },

  component: {
    viewBox: "0 0 32 32",
    strokeWidth: 1,
    stroke: "#eee",
    fill: "#eee",
    path: [
      "M24 15H12V1.5H24V15Z",
      "M16 19H26.5V26.5H16V19Z",
      "M7.5 13H1.5V26.5H7.5V13Z",
    ],
  },
  instance: {
    viewBox: "0 0 32 32",
    strokeWidth: 1,
    stroke: "#eee",
    fill: "transparent",
    path: [
      "M24 15H12V1.5H24V15Z",
      "M16 19H26.5V26.5H16V19Z",
      "M7.5 13H1.5V26.5H7.5V13Z",
    ],
  },
  ellipse: {
    viewBox: "-1 -1 34 34",
    fill: "#222",
    path: [
      "M16,0C7.178,0,0,7.178,0,16c0,2.279,0.47,4.481,1.397,6.546c0.227,0.504,0.818,0.729,1.322,0.503 s0.729-0.817,0.502-1.321C2.411,19.922,2,17.995,2,16C2,8.28,8.28,2,16,2s14,6.28,14,14s-6.28,14-14,14 c-3.235,0-6.391-1.13-8.885-3.181c-0.427-0.352-1.057-0.291-1.408,0.138c-0.351,0.426-0.289,1.057,0.137,1.407 C8.696,30.709,12.302,32,16,32c8.822,0,16-7.178,16-16S24.822,0,16,0z",
    ],
  },
  rectangle: {
    viewBox: "0 0 24 24",
    strokeWidth: 1,
    path: [
      "M22,7a1,1,0,0,0,1-1V2a1,1,0,0,0-1-1H18a1,1,0,0,0-1,1V3H7V2A1,1,0,0,0,6,1H2A1,1,0,0,0,1,2V6A1,1,0,0,0,2,7H3V17H2a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H6a1,1,0,0,0,1-1V21H17v1a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V18a1,1,0,0,0-1-1H21V7ZM19,17H18a1,1,0,0,0-1,1v1H7V18a1,1,0,0,0-1-1H5V7H6A1,1,0,0,0,7,6V5H17V6a1,1,0,0,0,1,1h1Z",
    ],
  },
  save: {
    stroke: "#222",
    fill: "#222",
    strokeWidth: 1,
    viewBox: "0 0 29.978 29.978",
    path: [
      "M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012v-8.861H25.462z",
      "M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193C15.092,18.979,14.62,18.426,14.62,18.426z",
    ],
  },
  pointer: {
    viewBox: "0 0 329.458 329.458",
    fill: "#eee",
    path: [
      "M150.493,312.365l18.232-93.682c4.284-22.037,25.621-43.35,47.666-47.601l79.79-15.42c22.037-4.251,23.548-15.68,3.373-25.516L40.594,3.975c-20.183-9.836-30.092-0.788-22.142,20.2l109.882,290.076C136.284,335.239,146.201,334.401,150.493,312.365z",
    ],
  },
  pencil: {
    viewBox: "0 0 528.899 528.899",
    path: [
      "M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069L27.473,390.597L0.3,512.69z",
    ],
  },
  arc: {
    path: [
      "M37.5 20C37.5 29.66 29.66 37.5 20 37.5C10.34 37.5 2.5 29.66 2.5 20C2.5 10.34 10.34 2.5 20 2.5C29.66 2.5 37.5 10.34 37.5 20Z",
      "M12.5 32.5C12.5 35.26 10.26 37.5 7.5 37.5C4.74 37.5 2.5 35.26 2.5 32.5C2.5 29.74 4.74 27.5 7.5 27.5C10.26 27.5 12.5 29.74 12.5 32.5Z",
    ],
  },
  line: {
    path: [
      "M12.5 32.5C12.5 35.26 10.26 37.5 7.5 37.5C4.74 37.5 2.5 35.26 2.5 32.5C2.5 29.74 4.74 27.5 7.5 27.5C10.26 27.5 12.5 29.74 12.5 32.5Z",
      "M37.5 7.67C37.5 10.52 35.26 12.83 32.5 12.83C29.74 12.83 27.5 10.52 27.5 7.67C27.5 4.82 29.74 2.5 32.5 2.5C35.26 2.5 37.5 4.82 37.5 7.67Z",
      "M30.89 9.17L10 30",
    ],
  },

  rotateleft: {
    viewBox: "2 -2 45 43",
    path: [
      "M29,10h-9V2c0-0.372-0.207-0.713-0.536-0.886c-0.328-0.172-0.727-0.147-1.033,0.063l-13,9 C5.161,10.364,5,10.672,5,11s0.161,0.636,0.431,0.822l13,9C18.601,20.94,18.8,21,19,21c0.159,0,0.318-0.038,0.464-0.114 C19.793,20.713,20,20.372,20,20v-8h9c6.065,0,11,4.935,11,11v11c0,0.553,0.448,1,1,1s1-0.447,1-1V23C42,15.832,36.168,10,29,10z",
    ],
  },
  turnleft: {
    viewBox: "0 0 48 48",
    path: [
      "M26,18c-4.381,0-8.656,0.935-12.495,2.667l-4.666-7.211c-0.205-0.316-0.57-0.492-0.947-0.451 c-0.375,0.041-0.696,0.29-0.829,0.643l-6,16c-0.111,0.297-0.075,0.63,0.098,0.896c0.173,0.266,0.462,0.434,0.78,0.453l17,1 C18.961,32,18.98,32,19,32c0.354,0,0.684-0.188,0.864-0.497c0.19-0.326,0.181-0.73-0.024-1.047l-5.233-8.088 C18.117,20.832,22.008,20,26,20c7.362,0,14.395,2.809,19.293,7.707c0.391,0.391,1.023,0.391,1.414,0 c0.391-0.391,0.391-1.023,0-1.414C41.437,21.022,33.889,18,26,18z",
    ],
  },
  delete: {
    stroke: "#333",
    strokeWidth: "5",
    path: ["M35 35L5 5", "M5 35L35 5"],
  },
  import: {
    stroke: "#30c2ff",
    strokeWidth: "1",
    viewBox: "00 0 20 20",
    path: [
      "M8.416,3.943l1.12-1.12v9.031c0,0.257,0.208,0.464,0.464,0.464c0.256,0,0.464-0.207,0.464-0.464V2.823l1.12,1.12c0.182,0.182,0.476,0.182,0.656,0c0.182-0.181,0.182-0.475,0-0.656l-1.744-1.745c-0.018-0.081-0.048-0.16-0.112-0.224C10.279,1.214,10.137,1.177,10,1.194c-0.137-0.017-0.279,0.02-0.384,0.125C9.551,1.384,9.518,1.465,9.499,1.548L7.76,3.288c-0.182,0.181-0.182,0.475,0,0.656C7.941,4.125,8.234,4.125,8.416,3.943z M15.569,6.286h-2.32v0.928h2.32c0.512,0,0.928,0.416,0.928,0.928v8.817c0,0.513-0.416,0.929-0.928,0.929H4.432c-0.513,0-0.928-0.416-0.928-0.929V8.142c0-0.513,0.416-0.928,0.928-0.928h2.32V6.286h-2.32c-1.025,0-1.856,0.831-1.856,1.856v8.817c0,1.025,0.832,1.856,1.856,1.856h11.138c1.024,0,1.855-0.831,1.855-1.856V8.142C17.425,7.117,16.594,6.286,15.569,6.286z",
    ],
  },
  export: {
    stroke: "#30c2ff",
    fill: "#279",
    strokeWidth: "1",
    viewBox: "0 0 24 24",
    path: [
      "M11 14.59V3a1 1 0 0 1 2 0v11.59l3.3-3.3a1 1 0 0 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 0 1 1.4-1.42l3.3 3.3zM3 17a1 1 0 0 1 2 0v3h14v-3a1 1 0 0 1 2 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3z",
    ],
  },
  trash2: {
    viewBox: "0 0 512 512",
    path: [
      "m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z",
      "m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z",
      "m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z",
      "m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z",
    ],
  },
  trash: {
    stroke: "#888",
    fill: "#222",
    strokeWidth: "1",
    viewBox: "00 0 20 20",
    path: [
      "M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z",
    ],
  },
  close: {
    viewBox: "0 0 20 20",

    path: [
      "M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z",
    ],
  },
  layer: {
    viewBox: "0 0 421.59 421.59",
    path: [
      "M400.491,291.098l-58.865-36.976l58.864-36.971c2.185-1.372,3.511-3.771,3.511-6.351s-1.326-4.979-3.511-6.352l-58.865-36.977l58.862-36.973c2.185-1.373,3.511-3.771,3.511-6.351s-1.326-4.979-3.511-6.351L214.783,1.149c-2.438-1.532-5.54-1.532-7.979,0L21.1,117.796c-2.185,1.373-3.511,3.771-3.511,6.351c0,2.58,1.326,4.979,3.511,6.351l58.861,36.972l-58.859,36.978c-2.185,1.373-3.51,3.771-3.51,6.351c0,2.58,1.326,4.979,3.511,6.351l58.859,36.97l-58.859,36.979c-2.185,1.372-3.51,3.771-3.51,6.351c0,2.58,1.326,4.979,3.511,6.351l185.7,116.64c1.22,0.766,2.604,1.149,3.989,1.149s2.77-0.383,3.989-1.149L400.491,303.8c2.185-1.372,3.511-3.771,3.511-6.351C404.002,294.869,402.676,292.47,400.491,291.098zM39.189,124.147l171.605-107.79l171.604,107.79l-171.604,107.79L39.189,124.147z M39.191,210.798l54.869-34.471l112.744,70.818c1.219,0.766,2.604,1.149,3.989,1.149c1.385,0,2.77-0.383,3.989-1.149l112.742-70.817l54.875,34.47L210.792,318.582L39.191,210.798z M210.792,405.232L39.191,297.448l54.87-34.472l112.742,70.814c1.22,0.766,2.604,1.149,3.989,1.149s2.77-0.383,3.989-1.149l112.744-70.812l54.876,34.47L210.792,405.232z",
    ],
  },
  "hamburger-round": {
    stroke: "#eee",
    fill: "#eee",
    viewBox: "-3 -3 33 33",
    path: [
      "M0,3.875c0-1.104,0.896-2,2-2h20.75c1.104,0,2,0.896,2,2s-0.896,2-2,2H2C0.896,5.875,0,4.979,0,3.875z M22.75,10.375H2c-1.104,0-2,0.896-2,2c0,1.104,0.896,2,2,2h20.75c1.104,0,2-0.896,2-2C24.75,11.271,23.855,10.375,22.75,10.375z M22.75,18.875H2c-1.104,0-2,0.896-2,2s0.896,2,2,2h20.75c1.104,0,2-0.896,2-2S23.855,18.875,22.75,18.875z",
    ],
  },
  menu: {
    stroke: "#eee",
    fill: "#eee",
    viewBox: "0 0 460 460",
    path: [
      "M0,382.5h459v-51H0V382.5z M0,255h459v-51H0V255z M0,76.5v51h459v-51H0z",
    ],
  },
  settings: {
    viewBox: "0 0 458.317 458.317",
    path: [
      "M446.185,179.159h-64.768c-2.536-7.702-5.636-15.15-9.26-22.29l45.818-45.818c4.737-4.737,4.737-12.416,0-17.152L364.416,40.34c-4.737-4.737-12.416-4.737-17.152,0l-45.818,45.818c-7.14-3.624-14.587-6.724-22.289-9.26V12.131	c0.001-6.699-5.429-12.129-12.128-12.129h-75.743c-6.698,0-12.129,5.43-12.129,12.128v64.768c-7.702,2.535-15.149,5.636-22.29,9.26L111.05,40.341c-4.737-4.737-12.416-4.737-17.152,0L40.339,93.9c-4.737,4.736-4.737,12.416,0,17.152l45.817,45.817c-3.624,7.14-6.725,14.588-9.26,22.29H12.129C5.43,179.159,0,184.59,0,191.288v75.743c0,6.698,5.43,12.128,12.129,12.128h64.768c2.536,7.702,5.636,15.149,9.26,22.29L40.34,347.266c-4.737,4.736-4.737,12.416,0,17.152l53.559,53.559c4.737,4.736,12.416,4.736,17.152,0l45.817-45.817c7.14,3.624,14.587,6.725,22.29,9.26v64.768c0,6.698,5.43,12.128,12.129,12.128h75.743c6.698,0,12.129-5.43,12.129-12.128v-64.768c7.702-2.535,15.149-5.636,22.289-9.26l45.818,45.817c4.737,4.736,12.416,4.736,17.152,0l53.559-53.559c4.737-4.737,4.737-12.416,0-17.152l-45.817-45.817c3.624-7.14,6.724-14.587,9.26-22.289h64.768c6.698,0,12.129-5.43,12.129-12.128v-75.743C458.314,184.59,452.884,179.159,446.185,179.159z M229.157,289.542c-33.349,0-60.384-27.035-60.384-60.384s27.035-60.384,60.384-60.384s60.384,27.035,60.384,60.384S262.506,289.542,229.157,289.542z",
    ],
  },
};

export default svgData;
