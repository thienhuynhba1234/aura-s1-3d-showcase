export const COLORWAYS = [
  {
    id: 'obsidian',
    name: 'Đen Obsidian',
    subtitle: 'Nhôm Anodized Đen Nhám & Vàng Champagne',
    swatch: '#1c1d22',
    swatchRing: '#d4b886',
    metalColor: '#1d1f24',
    yokeColor: '#2a2d35',
    accentColor: '#d4b886',
    leatherColor: '#16171b',
    meshColor: '#23262e',
    driverColor: '#c9a66b',
  },
  {
    id: 'titanium',
    name: 'Bạc Titan',
    subtitle: 'Titan Tự Nhiên Phay Xước & Da Xám Khói',
    swatch: '#c4c7ce',
    swatchRing: '#e4e4e7',
    metalColor: '#bfc4cc',
    yokeColor: '#d6dae0',
    accentColor: '#f4f4f5',
    leatherColor: '#3a3d45',
    meshColor: '#2c2f36',
    driverColor: '#d4d8df',
  },
  {
    id: 'champagne',
    name: 'Vàng Champagne',
    subtitle: 'Hợp Kim Vàng Ấm & Da Cừu Espresso',
    swatch: '#cbb082',
    swatchRing: '#ecd8b4',
    metalColor: '#c5aa7d',
    yokeColor: '#d9c29c',
    accentColor: '#f1dfb9',
    leatherColor: '#382a21',
    meshColor: '#29201a',
    driverColor: '#e2c185',
  },
];

export const CHAPTERS = [
  {
    id: 'hero',
    index: '01',
    shortLabel: 'Tổng quan',
    range: [0, 0.2],
    scrollTarget: 0.0,
  },
  {
    id: 'craftsmanship',
    index: '02',
    shortLabel: 'Chế tác',
    range: [0.2, 0.42],
    scrollTarget: 0.27,
  },
  {
    id: 'exploded',
    index: '03',
    shortLabel: 'Âm học 5 lớp',
    range: [0.42, 0.68],
    scrollTarget: 0.54,
  },
  {
    id: 'specs',
    index: '04',
    shortLabel: 'Hiệu năng ANC',
    range: [0.68, 0.85],
    scrollTarget: 0.76,
  },
  {
    id: 'configurator',
    index: '05',
    shortLabel: 'Phiên bản',
    range: [0.85, 1.0],
    scrollTarget: 0.96,
  },
];

export const EXPLODED_LAYERS = [
  {
    id: 0,
    code: 'L1',
    title: 'Vỏ Nhôm Nguyên Khối CNC',
    detail: 'Gia công từ phôi nhôm series-6000 dày 1.4mm, phủ anodized chống trầy và vòng xoay điều chỉnh âm lượng cơ khí.',
  },
  {
    id: 1,
    code: 'L2',
    title: 'Bo Mạch DSP Kép & Pin 45 Giờ',
    detail: 'Vi xử lý âm thanh 24-bit/192kHz tích hợp 6 cảm biến phản hồi độ trễ dưới 0.08ms cho chống ồn thích ứng.',
  },
  {
    id: 2,
    code: 'L3',
    title: 'Màng Loa Beryllium 40mm',
    detail: 'Màng loa siêu nhẹ phủ Beryllium cùng cuộn dây đồng OFC và nam châm Neodymium N52 tái tạo dải tần 5Hz – 45kHz.',
  },
  {
    id: 3,
    code: 'L4',
    title: 'Khoang Tiêu Âm Cộng Hưởng',
    detail: 'Cấu trúc buồng âm học phân tán sóng đứng giúp dải trung tách bạch và âm trường rộng tự nhiên.',
  },
  {
    id: 4,
    code: 'L5',
    title: 'Đệm Tai Memory Foam Da Cừu',
    detail: 'Bọc da cừu nguyên tấm thoáng khí, tự ôm theo đường viền tai giúp cách âm thụ động lên tới 24dB.',
  },
];

export const TECH_SPECS = [
  {
    label: 'Chống ồn chủ động',
    value: '-48 dB',
    note: 'Hybrid 6-Mic Adaptive ANC',
  },
  {
    label: 'Thời lượng pin',
    value: '45 Giờ',
    note: 'Sạc nhanh 10 phút nghe 6 giờ',
  },
  {
    label: 'Dải tần đáp ứng',
    value: '5 Hz – 45 kHz',
    note: 'Hi-Res Lossless qua USB-C DAC',
  },
  {
    label: 'Trọng lượng',
    value: '318 g',
    note: 'Phân bổ lực kẹp cân bằng 3.6 N',
  },
];

export const PRODUCT_PRICE_TEXT = '12.990.000 ₫';
export const PRODUCT_PRICE_VALUE = 12990000;
