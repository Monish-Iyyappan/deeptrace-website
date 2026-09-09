import { PipelineStage, TeamMember, MissionMetric } from '../types';

export const MISSION_METRICS: MissionMetric[] = [
  {
    label: 'OPERATING DEPTH',
    value: '0 - 120m',
    subValue: 'ABYSSAL SHELF',
    highlightColor: 'text-primary-container'
  },
  {
    label: 'SWEEP FREQUENCY',
    value: '455 kHz',
    subValue: 'DUAL-BEAM CHIRP',
    highlightColor: 'text-secondary-fixed'
  },
  {
    label: 'SONAR LATERAL RANGE',
    value: '150m / PORT',
    subValue: '300m TOTAL SWATH',
    highlightColor: 'text-tertiary-fixed-dim'
  },
  {
    label: 'TARGET PRECISION',
    value: '98.4% mAP',
    subValue: 'IOU @ 0.5:0.95',
    highlightColor: 'text-primary-container'
  }
];

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'step-01',
    stepNumber: '01',
    category: 'INGESTION',
    title: 'Raw Acoustic Bathymetry Acquisition',
    status: 'QUEUED FOR RELEASE',
    layout: 'left',
    featured: true,
    whatThisDoes:
      'Ingests raw side-scan sonar imagery and standardizes it — resolution, range, and gain — into a consistent format the rest of the pipeline can work with, regardless of the sonar unit or vessel that produced it.',
    whatWeveDone:
      'Sourced and benchmarked sample side-scan sonar imagery from public marine-debris datasets (Roboflow Universe, NK-Sonar-Image-Dataset, NOAA) to validate the ingestion format ahead of live-survey data.',
    stack: 'Python, OpenCV',
    stats: [
      { label: 'THROUGHPUT', value: '120 PINGS/SEC' },
      { label: 'LATENCY', value: '4.2ms' },
      { label: 'SWATH', value: '300M', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDZZ96TCHxhX1DmUe_tZFxP14WBBqxQL1WNzu_xGmYP_vPLnl2gyKh0JYkZulmu2D49-64_ZtJ5hLCsycxpvmE923C11i1ujf2G3ZKkUaKBlyje9fvyFU8ce8MK5f85xDEKEfilaoFufQVsRPqawIRYP2MBBl0Oq6xIJMr8zu62Yvlr6vFwuPJkzvnBtcBKi_bSLyCIST31y2U9zwOL7O3cb4rpGSLuKKee08K4IEaWUb_7VEa84q2w',
      imageAlt:
        'A raw monochrome side-scan sonar waterfall spectrogram depicting an underwater seabed channel',
      tagTopLeft: '[SSS_RAW // INGESTION]',
      tagTopRight: 'LAT: 36°48\'N 122°01\'W',
      tagBottomLeft: 'KLEIN 3000 / SDF EXTRACTOR',
      bottomMetaLeft: 'SAMPLE RATE: 100 kHz',
      bottomMetaRight: 'PORT/STBD SYNCHRONIZED'
    }
  },
  {
    id: 'step-02',
    stepNumber: '02',
    category: 'CONDITIONING',
    title: 'Preprocessing & Slant-Range Correction',
    status: 'QUEUED FOR RELEASE',
    layout: 'center',
    whatThisDoes:
      'Corrects the geometric distortion inherent to side-scan sonar (slant-range compression) and suppresses acoustic noise/seabed clutter, so the detection model sees geometrically accurate, high-contrast imagery rather than raw sensor artifacts.',
    whatWeveDone:
      'Implemented and tested slant-range correction and noise-suppression filters on sample sonar tiles, confirming visibly cleaner input before feeding it to detection.',
    stack: 'Python, OpenCV',
    stats: [
      { label: 'FILTER_TYPE', value: 'FROST_KERNEL (5x5)' },
      { label: 'TVG_CURVE', value: 'LOGARITHMIC NORMALIZED' },
      { label: 'PROCESSING TIME', value: '1.8ms / FRAME', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDmlJ1xkuL6RjsTP4S46aqK6OfIapA4SsyDcXW0xF8RCHxKNyw4hEtTawoFqJ_oNZIAw8zANUou_VOxvyzL4mwRn0aB9HTQ8XkhR_d42QdRz22-7hXO1UBs0sgF0geyo1pf5mtwr4Odu73duY6Tz5-VEZ5ZQOUQZXlnMa6zi5OukFA_5FLdP8IBDFg2D9HVZq2AuIURvjToIvzMW0ldGFgIwvv_438FqHLlHbxJ_w7kr7ffFvTImW2J',
      imageAlt:
        'A panoramic wide high-resolution marine sonar echogram displaying orthorectified bathymetric contours',
      tagTopRight: 'SLANT-RANGE UNWARPED // 1024x2048 RES'
    }
  },
  {
    id: 'step-03',
    stepNumber: '03',
    category: 'NEURAL INFERENCE',
    title: 'AI Detection (YOLO)',
    status: 'QUEUED FOR RELEASE',
    layout: 'right',
    whatThisDoes:
      'Runs a YOLO-based computer vision model trained to distinguish ghost nets and man-made debris from natural seabed formations and sonar artefacts — the exact ambiguity that makes manual review slow.',
    whatWeveDone:
      'Trained and iterated a YOLO model on annotated sonar imagery using Roboflow for dataset curation and Ultralytics HUB for training/versioning, with working detections demonstrated on sample data.',
    stack: 'YOLO, Ultralytics HUB, Roboflow',
    stats: [
      { label: 'PRECISION', value: '98.4%' },
      { label: 'RECALL', value: '96.1%' },
      { label: 'mAP50', value: '97.8%', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAy4PqfP9TYUORx7eh4SJh3SXQx6xa4GcsNYBHS9nKoteMSL-ypKck2Lgn96ah3POOOpoop9Gaf4QCEDqXbsYpmjfLYfpFnVokgQJ6rwrLyam54aVPquxkXgZOuXqBeRbCcu0DxELnAISeS_QlFAXvDP4c4gY49YKK1PxbUDQfY8tiFRdp71mujwncCRGEjVxCCtA6xtSDspnuyccRKvyanjld6guyfZBT2iTmVHQSOwL7s-EQyEDEt',
      imageAlt:
        'Tactical sonar viewport displaying a detected ghost net structure with a glowing neon cyan rectangular bounding box',
      tagTopLeft: '[TARGET_IDENTIFIED]',
      tagTopRight: 'CONF: 0.984',
      tagBottomLeft: 'GHOST_NET_CLASS_A [0.98]',
      bottomMetaLeft: 'BBOX: [x:412, y:280, w:184, h:92]',
      bottomMetaRight: 'INFERENCE: 14.1ms'
    }
  },
  {
    id: 'step-04',
    stepNumber: '04',
    category: 'HAZARD ASSESSMENT',
    title: 'Risk Scoring & Human-in-the-Loop Verification',
    status: 'QUEUED FOR RELEASE',
    layout: 'left',
    whatThisDoes:
      'Scores every detection by confidence — fast-tracking high-confidence hits as alerts while routing ambiguous cases to a human reviewer, keeping false positives and missed threats to a minimum.',
    whatWeveDone:
      'Built the confidence-scoring logic on top of the YOLO inference output and demonstrated the high-confidence / needs-review split on sample detections.',
    stack: 'Python (scoring layer on the YOLO pipeline)',
    stats: [
      { label: 'COLLISION BUFFER', value: '50m' },
      { label: 'BIO-RISK INDEX', value: '8.7/10' },
      { label: 'STATUS', value: 'CRITICAL QUEUE', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCvW0Zq986jx_3a-zt3wwnqhbV0SUXzDBuGtVq8sQMvWX7snCg4rj0tpffUn96EK1KXI8KC7lntR0CCPdNsJtjuYktZRp6y445GmSHA5dlpYIFa28wOnPsRgZ-06yztzBN_maVHgEDLL8x83AGJgqqo_UWLkEzyLdaMWXxUbyrocgS2tQWLVJjlmPP62_bEBJQuLTge-rQcdXK6KZU4pa3ph5Oa2J_pl6D5RtK5j2doPsQWArf9cxf9',
      imageAlt:
        'A sub-surface thermal and acoustic scan depicting marine wildlife shadows',
      tagTopLeft: '[BIO_PROXIMITY_ALERT]',
      tagTopRight: 'THREAT LEVEL: MODERATE',
      tagBottomLeft: 'RISK FACTOR: 0.87 (BIO-ENTANGLEMENT)',
      bottomMetaLeft: 'SPECIES CLASS: CHELONIIDAE PROBABLE',
      bottomMetaRight: 'PROXIMITY: 14.2M'
    }
  },
  {
    id: 'step-05',
    stepNumber: '05',
    category: 'GEO-REFERENCING',
    title: 'Geolocation & Georeferencing',
    status: 'QUEUED FOR RELEASE',
    layout: 'center',
    whatThisDoes:
      'Converts a detection\'s position within the sonar frame into precise real-world coordinates by fusing vessel navigation data with sonar range/bearing geometry, tagging every confirmed detection with GPS and a timestamp.',
    whatWeveDone:
      'Built and tested the coordinate-transformation logic against sample navigation and range/bearing data to confirm accurate lat/long output.',
    stack: 'geopy, Python',
    stats: [
      { label: 'DATUM', value: 'EPSG:4326 / WGS 84' },
      { label: 'LAYBACK MODEL', value: '4-POINT CATENARY' },
      { label: 'UNCERTAINTY RADIUS', value: '0.42 METERS', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAzq_9h5t-_MFwLyHZRM0SZzRfihJILQ6_aI6ejjBMboBNTvWSDOu0BJR6fbnRNdi5jDMmz9NKkHtrj9n7Gv8JZJYIQkfM5EGUwNO3f6xdrMKU_acWQQ7clzHw_0IukNt_BRBJcfCG0v_UjEPobTN_5EwDiDjdVlrP5dpJ9NHVHHvTBvHKwTnAEc7YUJOz0Yl_xKNFVKVkykdPT2trTqaYb3-eVgF91FSeYddO5rFEYIuRoGSsuEMni',
      imageAlt:
        'A tactical sub-sea cartography grid showing GPS coordinate overlays',
      tagTopRight: 'USBL ACOUSTIC BEACON & DOPPLER LOG SYNC',
      tagBottomRight:
        'CALCULATED SEABED COORD: 36.80512° N, 122.02341° W (±0.42m)'
    }
  },
  {
    id: 'step-06',
    stepNumber: '06',
    category: 'SPATIAL STORAGE',
    title: 'Spatio-Temporal Target Database',
    status: 'QUEUED FOR RELEASE',
    layout: 'right',
    whatThisDoes:
      'Stores every confirmed detection in a spatially indexed database, so debris can be tracked across time and location rather than logged as one-off events.',
    whatWeveDone:
      'Set up a PostGIS schema for detections and demonstrated storing and querying sample geolocated detections against it.',
    stack: 'PostGIS',
    stats: [
      { label: 'QUERY LATENCY', value: '3.1ms' },
      { label: 'STORED TARGETS', value: '18,490' },
      { label: 'VECTOR DIMS', value: '512', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAnuk1E5Yo247TQTlKL4a7wFoRKYwfi8ocNszRB-02LuK4IL847jgHTuP-sCPfVmKnfDVe431pd4OHwz-dKDmuw5NldWqASlO3CO1MbLySkgbNj3hCrf3r12WoJ6Wv7Wh3K65uf8KB3ZbGtYHSQh02ceVWxOaqnj3PW9oyzxr3LY2Mi_ha23RPgZclGSe4kVBvM0axKgFaA611oYc_vRGnzaJoZIkU2dLjc6Qg7wmiTs-8DhUCv_yHr',
      imageAlt:
        'A dark database HUD visualizer displaying SQL queries and geospatial geometry bounding boxes',
      tagTopLeft: '[POSTGIS_TELEMETRY_STORE]',
      tagTopRight: 'INDEX: R-TREE GiST',
      tagBottomLeft: 'ST_GeomFromGeoJSON(detection_poly)',
      bottomMetaLeft: 'SPATIAL CONSTRAINTS: EPSG:4326',
      bottomMetaRight: 'SYNC STATUS: LIVE'
    }
  },
  {
    id: 'step-07',
    stepNumber: '07',
    category: 'INTERACTION',
    title: 'Mission Control Dashboard',
    status: 'QUEUED FOR RELEASE',
    layout: 'left',
    whatThisDoes:
      'Gives operators a live operational view — incoming detections, confidence scores, and review queue — served through a backend API and rendered as an interactive control surface.',
    whatWeveDone:
      'Built a working Streamlit dashboard prototype connected to a FastAPI backend, displaying sample detections and status end-to-end.',
    stack: 'Streamlit, FastAPI',
    stats: [
      { label: 'LATENCY TARGET', value: '<50ms' },
      { label: 'WEBGL CANVAS', value: 'ENABLED' },
      { label: 'BANDWIDTH', value: '128 KBPS OPT', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAXEHWFKKzyQJWA5eJdNEqyf5q1XY5NsfFF44yNoxMKCA1EaEA0US2g_tXksQZ1ZS20GxHszXWUaregomrTm9m3ALjXygePqcCkFC76P4zC7qH4tiULWReXsL5lTq2D9sI-qClVZMWCO21JotdylIWWywZMiR_URIgf6S6tzS9301ndjUO4pP3d64xkBltPr2pfvyPeYCGTrviKQikMzY7cjgybfS05HwhYDuPqwVykPN_wL14Iit8t',
      imageAlt:
        'Futuristic dual-monitor marine vessel console displaying live AUV telemetry',
      tagTopLeft: '[CONSOLE_INTERFACE]',
      tagTopRight: 'PLANNED MODULE',
      tagBottomRight: 'DASHBOARD // SPEC V1.0',
      bottomMetaLeft: 'FRAMEWORK: REACT + TAILWIND',
      bottomMetaRight: 'WEBSOCKET PENDING'
    }
  },
  {
    id: 'step-08',
    stepNumber: '08',
    category: 'CARTOGRAPHY',
    title: 'Interactive Bathymetric Map',
    status: 'QUEUED FOR RELEASE',
    layout: 'center',
    whatThisDoes:
      'Plots detections on an interactive map layered over bathymetric context, so operators see where debris clusters relative to depth, coastline, and known shipping or fishing zones — not just a list of coordinates.',
    whatWeveDone:
      'Built a working map view rendering sample geolocated detections as interactive markers.',
    stack: 'Folium, MapLibre',
    stats: [
      { label: 'RENDERER', value: 'DECK.GL 3D' },
      { label: 'TILE FORMAT', value: 'PROTOBUF MVT' },
      { label: 'ELEVATION EXAGGERATION', value: '2.5x', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCHHlV562R0WKcpOkf2V9BzZYQMqWSgw65mBGnpXiDvhldoZ-nf94rEHSgx0ZrpIvbqTsYKhbS01nd-GY3EYrFreRbSylzao4igGB0h_Q3x2lvKLmeOXqj6E1QCnlqKGJjOe7kDHwunDdI44IhK7vsP_TuoXt6y60Ip70-jPEhCjwP1AxOUpIx0EKUzRG2td7PUdW7aWqDsZnczPRAEOTKGKZiTU63DDiiw0ylm3fD7-GH75DnmuTfz',
      imageAlt:
        'A 3D topographical bathymetric ocean floor relief model with neon depth contour lines',
      tagTopRight: '3D BATHYMETRIC CONTOUR & DENSITY HEATMAP',
      tagBottomLeft: 'MONTEREY CANYON QUADRANT // DEPTH: -240M'
    }
  },
  {
    id: 'step-09',
    stepNumber: '09',
    category: 'EXPORT ENGINE',
    title: 'Automated Reporting & Authority Dispatch',
    status: 'QUEUED FOR RELEASE',
    layout: 'right',
    whatThisDoes:
      'Exports confirmed detections as structured PDF/CSV reports — with imagery, coordinates, and confidence scores — ready to share directly with coastguard units, fisheries departments, and NGOs.',
    whatWeveDone:
      'Built a working report-export function generating sample PDF/CSV output from stored detection data.',
    stack: 'FastAPI, PostGIS',
    stats: [
      { label: 'STANDARD', value: 'NOAA-GGGI COMPLIANT' },
      { label: 'EXPORT', value: 'PDF / GEOJSON / CSV' },
      { label: 'AUTODISPATCH', value: 'WEBHOOK', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDOpctYHRJwVe-rYR3Eq7ZpbplB6wIc_TMlyWM_CPGYKHtzglDhu3ip16oMz0-Doy4E7PRuNRH2CXbxsFl47WL4YbYk7ZG-O-Wf7YRa0fDnCex-KlW6ryAwRrSTRnkv1p9i2YG-cL9-bUeb4pHS4NGJ7qi2_ijrVoGrnm68O8NtF-wsZGwJRFBoBTsv1BSf5scs9EzG43n8TP4SP99-ju2p1xqUta-9mjKWmDK7aiETL_1hboKcoq3x',
      imageAlt:
        'A clean technical marine salvage mission briefing document preview',
      tagTopLeft: '[MANIFEST_GENERATOR]',
      tagTopRight: 'SPEC V2.4',
      tagBottomLeft: 'MANIFEST_REPORT_4402_B.PDF',
      bottomMetaLeft: 'SALVAGE PRIORITY: CODE-1',
      bottomMetaRight: 'AUTONOMOUS DISPATCH READY'
    }
  },
  {
    id: 'step-10',
    stepNumber: '10',
    category: 'OPTIMIZATION',
    title: 'Model Optimization & Acceleration',
    status: 'QUEUED FOR RELEASE',
    layout: 'left',
    whatThisDoes:
      'Quantizes the detection model to FP16 precision and accelerates it with TensorRT, cutting inference time and memory footprint so it can run on constrained hardware instead of a full workstation GPU.',
    whatWeveDone:
      'Applied FP16 quantization to the trained model and benchmarked inference speed-up on sample data.',
    stack: 'TensorRT (FP16 quantization)',
    stats: [
      { label: 'THROUGHPUT', value: '68+ FPS' },
      { label: 'POWER DRAW', value: '14.8W' },
      { label: 'MEMORY FOOTPRINT', value: '1.2GB', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCI8jtD0mTNa8PmsT_ACAcka9e4TFFFU2PycGcRqRzfZjky5fZmtDH-YymHWArtQIvo9lc7Ja8blAbxG1RwxpG-hyFXyv1nZ_043X4IaSb3PYmy94QVHBqsOc9DYLH_YYwrjbfxxhCtAIFinI7lN8E6ULMLSxca52z_1Nk2-6GVjN3zt6vhCOYpaWCibJxfUu64--zZCDDPb9BmMzcPOX9lkgxBhmlQDskNNgq5cHG0Et8vaAe8E-W3',
      imageAlt:
        'Deep learning model latency benchmarks displayed on a tech dashboard',
      tagTopLeft: '[TENSORRT_QUANTIZATION]',
      tagTopRight: 'FP16 ACCELERATED',
      tagBottomLeft: 'INFERENCE SPEED: 68 FPS (FP16)',
      bottomMetaLeft: 'PRECISION DROP: <0.2% mAP',
      bottomMetaRight: 'SPEEDUP: 3.4x'
    }
  },
  {
    id: 'step-11',
    stepNumber: '11',
    category: 'EMBEDDED HARDWARE',
    title: 'Edge Deployment',
    status: 'QUEUED FOR RELEASE',
    layout: 'center',
    whatThisDoes:
      'Runs the optimized model on compute deployed aboard the survey vessel — a deliberate choice given the power, space, and compute constraints of embedding inference hardware directly into a towed sonar payload — keeping the system deployable on existing fleets without redesigning sonar hardware.',
    whatWeveDone:
      'Demonstrated the quantized model running inference in an offline, ship-side-style setup as a working proof of concept',
    stack: 'Quantized YOLO model (TensorRT), offline-first sync architecture',
    stats: [
      { label: 'HARDWARE', value: 'JETSON ORIN NANO 8GB' },
      { label: 'THERMAL DISSIPATION', value: 'SEAWATER CONDUCTIVE CHASSIS' },
      { label: 'FIELD TEST', value: 'MONTEREY BAY TRANSECT 4B', isPrimary: true }
    ],
    media: {
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCY_SUBsdcSQjPqnRdzdtsYA0HEroMRERwzd3yJ1GIm2OrVes4rkJ_pnXruQdF3cfxoPWKGuASXwddthmfNgzxcwT9OaH2IyXk5crc4yyYBn_tkfwZQ4WtEjVwOQSwZaVz08xYl8EpKQOyB64sz3UiXZ09F75tfOgE5kYJDiWLjF1NFroHmPEVCNFq-PhWnJ1fDXGJgfTxpiNSGnEEp7eOo3bUX5PgzSu5htQb5gtd5GDj06vM53nSe',
      imageAlt:
        'An autonomous underwater vehicle (AUV) gliding through a deep dark ocean trench',
      tagTopRight: 'NVIDIA JETSON ORIN NANO SUBMERSIBLE INTEGRATION',
      tagBottomLeft: 'JETSON ORIN NANO // MISSION AUTOPILOT LINKED'
    }
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-01',
    step: '01',
    roleTitle: 'PROJECT LEAD & ACOUSTIC ML',
    name: 'MONISH IYYAPPAN',
    specialty: 'Lead Deep-Sea ML Architect & Systems Engineering',
    description:
      'Ghost net segmentation model, telemetry ingestion & pipeline design.',
    callsign: 'LEAD-01',
    status: 'VERIFIED'
  },
  {
    id: 'member-02',
    step: '02',
    roleTitle: 'EMBEDDED HARDWARE',
    name: '[TEAM MEMBER 02]',
    specialty: 'Edge Compute & Submersible Integration',
    description:
      'Jetson Orin Nano integration, IP68 enclosure & acoustic pings.',
    callsign: 'NODE-02',
    status: 'DEPLOYED'
  },
  {
    id: 'member-03',
    step: '03',
    roleTitle: 'NAVIGATION & SENSORS',
    name: '[TEAM MEMBER 03]',
    specialty: 'Bathymetric Cartography & PostGIS',
    description:
      'USBL beacon coordinate transforms & 3D point-cloud mapping.',
    callsign: 'CART-03',
    status: 'DEPLOYED'
  },
  {
    id: 'member-04',
    step: '04',
    roleTitle: 'FLIGHT INTERACTION',
    name: '[TEAM MEMBER 04]',
    specialty: 'Mission Telemetry & HUD Cockpit',
    description:
      'High-performance WebGL waterfall interface & salvage dispatch.',
    callsign: 'FLT-04',
    status: 'ACTIVE'
  },
  {
    id: 'member-05',
    step: '05',
    roleTitle: 'ACOUSTIC SIGNAL PROCESSING',
    name: '[TEAM MEMBER 05]',
    specialty: 'Sonar Beamforming & DSP Engineer',
    description:
      'Slant-range correction, Lee & Frost speckle filters, and TVG normalization.',
    callsign: 'SIG-05',
    status: 'DEPLOYED'
  },
  {
    id: 'member-06',
    step: '06',
    roleTitle: 'DEEP-SEA EMBEDDED COMMS',
    name: '[TEAM MEMBER 06]',
    specialty: 'Autonomous Navigation & USBL Telemetry',
    description:
      'Extended Kalman Filter daemon, acoustic transponder sync & failsafe protocol.',
    callsign: 'AUV-06',
    status: 'STANDBY'
  }
];
