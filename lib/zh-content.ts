import {
  FOUNDER,
  LEGAL_NAME,
  LEGAL_NAME_BG,
  ORGANIZATION_EMAIL,
  ORGANIZATION_PHONE_DISPLAY,
  ORGANIZATION_UIC,
  SITE_NAME,
} from "@/lib/metadata";

export const ZH_WORK_CATEGORIES = [
  "时尚杂志大片",
  "商业广告",
  "产品画册",
  "时装秀",
  "美妆",
  "生活方式",
  "数字内容",
] as const;

export const ZH_PAGE_TITLE = "保加利亚索非亚精品模特经纪公司";

export const ZH_PAGE_DESCRIPTION = `${SITE_NAME}（VÈLISHE）是一家位于保加利亚索非亚的精品模特经纪公司，法定名称为 ${LEGAL_NAME}，UIC ${ORGANIZATION_UIC}。签约女模与男模，承接时尚与商业拍摄。档期询盘请发邮件至 ${ORGANIZATION_EMAIL}。`;

type ZhHomeCopyArgs = {
  modelCount: number;
  locationPhrase: string;
};

export function buildZhHomeCopy({ modelCount, locationPhrase }: ZhHomeCopyArgs) {
  const bookingsClause = locationPhrase
    ? `目前档期包括${locationPhrase}。`
    : "";

  const intro = `${SITE_NAME}（VÈLISHE）是一家成立于2025年、总部位于保加利亚索非亚的精品模特经纪公司。法定实体为 ${LEGAL_NAME}（保加利亚语：${LEGAL_NAME_BG}），统一识别码（UIC/EIK）为 ${ORGANIZATION_UIC}。公司目前签约 ${modelCount} 名职业女模与男模，业务覆盖时尚杂志大片、商业广告、产品画册、时装秀、美妆、生活方式与数字内容。创始人兼首席执行官为${FOUNDER.nameZh}（${FOUNDER.name}）。${bookingsClause}公司从索非亚以英语和保加利亚语处理询盘；中文客户可通过电子邮件 ${ORGANIZATION_EMAIL} 或 WhatsApp ${ORGANIZATION_PHONE_DISPLAY} 联系档期与报价。签约名单分为 Mainboard（成熟模特）与 Development（新面孔）；VÈLISHE 学院是独立培训项目，完成课程并不等于签约。女模通常最低身高 173 厘米，男模 183 厘米。`;

  const whatWeDo = `${SITE_NAME} 从保加利亚索非亚为本地及国际项目预订并培养时尚与商业模特。模特工作覆盖七类：时尚杂志大片、商业广告、产品画册、时装秀、美妆、生活方式与数字内容。经纪公司对接品牌、创意总监与摄影师，并在预订之后继续跟进作品集、市场定位与职业规划。客户通过 ${ORGANIZATION_EMAIL} 提交试镜或指定模特，索非亚办公室以英语或保加利亚语回复。签约名单分为 Mainboard（成熟模特）与 Development（新面孔），可在本站英文页面浏览；每位模特页含身高、围度与简介。VÈLISHE 学院是培训项目，不等于签约。公司同时经纪女模与男模，并安排索非亚及海外通告。`;

  const requirements = `Velishe 女模通常最低身高 173 厘米，男模 183 厘米。申请者须提交未经滤镜、未修图、未化妆、未接发的自然照片：正面、全侧面、半侧面与全身。女模一般穿黑色背心或泳衣配高跟鞋，男模穿合身牛仔裤或泳衣。申请通过网站 Become a Model 页面滚动审核；公司只联系符合当前需求的申请人，无法回复每一份资料。申请人须年满 16 岁，并提供 Instagram 账号与厘米制围度。单张图片不超过 1 MB，整组不超过 4 MB。公司经纪女模与男模，按经验分入 Mainboard 或 Development。`;

  const academy = `VÈLISHE 学院是设在索非亚的结构化培训项目，面向希望了解行业运作的准模特与已签约模特。课程覆盖五个方向：复合卡与试镜准备、片场职业规范、行业礼仪、作品集打造，以及如何维持模特生涯。招生按期次进行，请在学院页面加入候补名单以获取下一期通知。课程提供英语与保加利亚语。学院由 ${SITE_NAME} 运营，与 Mainboard、Development 签约名单分开——完成课程本身并不意味着签约。各模块说明与结业证书样式见学院页面。`;

  const booking = `客户预订 Velishe 模特用于广告、杂志大片与商业制作，请将试镜需求或制作简报发送至 ${ORGANIZATION_EMAIL}。请注明日期、使用权、拍摄地，以及需要 Mainboard、Development 或指定模特。团队从索非亚回复，工作语言为英语与保加利亚语。也可通过 WhatsApp ${ORGANIZATION_PHONE_DISPLAY} 或 Instagram @velishe.mgmt 做首次联系。公司资料、UIC 与创始人信息见 Contact 页面。法定实体为在保加利亚注册的 ${LEGAL_NAME}。有意成为模特者请通过 Become a Model 页面申请；请勿把申请发到预订邮箱。`;

  return {
    intro,
    whatWeDo,
    requirements,
    academy,
    booking,
    questions: {
      about: "关于 VÈLISHE",
      whatWeDo: "Velishe Model Management 做什么？",
      requirements: "成为 Velishe 模特需要什么条件？",
      academy: "VÈLISHE 模特学院是什么？",
      booking: "如何预订模特或申请加入 Velishe？",
    },
  };
}
