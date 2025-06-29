export const hierarchicalLocations = [
  {
    value: 'jiangsu',
    label: '江苏省',
    children: [
      {
        value: 'wuxi',
        label: '无锡市',
        children: [
          {
            value: 'huishanqu',
            label: '惠山区',
            children: [
              {
                value: 'yanqiao',
                label: '堰桥',
              },
            ],
          },
        ],
      },
      {
        value: 'nanjing',
        label: '南京市',
        children: [
          {
            value: 'xuanwu',
            label: '玄武区',
            children: [
              { value: 'meiyuan', label: '梅园新村街道' },
              { value: 'xuanwumen', label: '玄武门街道' },
            ],
          },
          {
            value: 'qinhuai',
            label: '秦淮区',
            children: [
              { value: 'hongwu', label: '洪武路街道' },
              { value: 'ruijin', label: '瑞金路街道' },
            ],
          },
        ],
      },
      {
        value: 'suzhou',
        label: '苏州市',
        children: [
          {
            value: 'gusu',
            label: '姑苏区',
            children: [
              { value: 'guanqian', label: '观前街道' },
              { value: 'pingjiang', label: '平江街道' },
            ],
          },
          {
            value: 'wuzhong',
            label: '吴中区',
            children: [
              { value: 'mudu', label: '木渎镇' },
              { value: 'xiangshan', label: '香山街道' },
            ],
          },
        ],
      },
    ],
  },
]
