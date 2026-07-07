/* 六爻读盘 PWA - static app with local notes + optional GitHub Gist cloud sync */

const STEPS = [
  { id: 1, title: '明确占事', desc: '先把问题变成一句可判断的话。', do: ['写清楚问什么，不要一卦多问。', '确认这是问成败、吉凶、得失、时间，还是人物状态。', '先定“我方/对方/事情本身”。'], output: '得到一个清楚的问题边界。', fill: ['本卦问的是：____。', '这件事的我方是：____；对方/事体是：____。', '我最想判断的是：成败 / 吉凶 / 应期 / 选择 / 失物 / 其他____。'], knowledge: ['K29','K02','K05'] },
  { id: 2, title: '核对排盘', desc: '把网页排盘中的关键盘面抄准。', do: ['记录月建、日辰、日空。', '记录本卦、变卦、动爻、世爻、应爻。', '记录每爻地支、六亲、六神、伏神。'], output: '得到可复查的原始盘面。', fill: ['月建：____；日辰：____；日空：____。', '本卦：____；变卦：____。', '动爻：____；世爻：____；应爻：____。'], knowledge: ['K01','K05','K10','K13','K24'] },
  { id: 3, title: '定世应主客', desc: '先分清谁代表自己，谁代表对方或事体。', do: ['世爻通常代表自己、我方、求测者、当前状态。', '应爻通常代表对方、外界、目标、事情所面对的对象。', '看世应是否生、克、合、冲。'], output: '得到主客关系的第一层判断。', fill: ['世爻是：____；它代表：____。', '应爻是：____；它代表：____。', '世应关系是：生 / 克 / 合 / 冲 / 比和 / 无直接关系。'], knowledge: ['K05','K22','K25'] },
  { id: 4, title: '取用神', desc: '按占事选出最核心的六亲。', do: ['先按占事类型选六亲。', '找出盘中用神所在爻。', '不要一开始就看六神和卦辞，先把用神定准。'], output: '得到本卦的核心判断对象。', fill: ['本事应取的用神六亲是：父母 / 兄弟 / 子孙 / 妻财 / 官鬼。', '用神出现在第____爻，地支____，六神____。', '如果找不到用神：是否有伏神？____。'], knowledge: ['K01','K02','K08','K23'] },
  { id: 5, title: '处理两现与伏神', desc: '用神不止一个或藏起来时，先定哪个才主事。', do: ['用神两现：优先看发动、临世应、旺相、有月日扶助、贴近事情的一爻。', '用神不上卦：看伏神，分析飞神是否压住或生扶伏神。', '不要把所有同类六亲都当主用神。'], output: '确定主用神、副用神、伏神。', fill: ['用神是否两现：是 / 否。主用神是第____爻，因为____。', '是否有伏神：是 / 否。伏神是____，飞神是____。', '飞神对伏神：生 / 克 / 合 / 冲 / 无明显作用。'], knowledge: ['K03','K04','K16','K17'] },
  { id: 6, title: '看月日旺衰', desc: '先判断用神有没有根气。', do: ['看用神是否得月建生扶、临月、月合。', '看用神是否得日辰生扶、临日、日合。', '判断旺相休囚死，不要只看一个日辰就下结论。'], output: '得到用神强弱的底盘。', fill: ['用神对月建：生 / 克 / 比和 / 临月 / 月破 / 无。', '用神对日辰：生 / 克 / 比和 / 临日 / 日破 / 日冲 / 无。', '用神总体为：旺 / 相 / 平 / 休囚 / 死弱。'], knowledge: ['K09','K10','K11','K12'] },
  { id: 7, title: '查空破墓绝', desc: '找出会让事情暂时不成或无力的关键病点。', do: ['查用神、世爻、应爻、动爻是否旬空。', '查是否月破、日破、入墓、绝地。', '判断是暂时问题，还是根本无力。'], output: '得到空、破、墓、绝的风险清单。', fill: ['用神是否空：是 / 否；何时出空或填实：____。', '用神是否破：月破 / 日破 / 无。', '是否入墓或绝地：是 / 否；说明____。'], knowledge: ['K13','K14','K11','K12'] },
  { id: 8, title: '看动爻', desc: '动爻是事情正在变化和发动的地方。', do: ['列出全部动爻。', '先看动爻是否作用到用神、世爻、应爻。', '判断动爻自身是否有力。'], output: '得到谁在推动、阻碍或改变事情。', fill: ['动爻有：第____爻。', '主要动爻是：第____爻，因为____。', '动爻对用神/世/应的作用是：生 / 克 / 冲 / 合 / 墓 / 无。'], knowledge: ['K15','K16','K17','K06'] },
  { id: 9, title: '看变爻', desc: '动爻变出什么，代表事情之后变成什么。', do: ['每个动爻都看其变爻。', '重点查回头生、回头克、化进、化退、化空、化破、化墓、化合、化冲。', '判断变化是变好、变坏、暂缓、受困。'], output: '得到事情后续变化方向。', fill: ['主要动爻化出：____。', '属于：回头生 / 回头克 / 化进 / 化退 / 化空 / 化破 / 化墓 / 化合 / 化冲 / 其他。', '这个变化说明：____。'], knowledge: ['K18','K19','K20','K21'] },
  { id: 10, title: '定原忌仇', desc: '找出帮助用神和伤害用神的力量。', do: ['生用神者为原神。', '克用神者为忌神。', '生忌神、克原神者为仇神。', '看原忌仇是否旺、动、空、破。'], output: '得到助力和阻力结构。', fill: ['原神是：____；状态：旺 / 弱 / 动 / 空 / 破。', '忌神是：____；状态：旺 / 弱 / 动 / 空 / 破。', '仇神是：____；它的作用：____。'], knowledge: ['K07','K06','K15','K16'] },
  { id: 11, title: '复核世应关系', desc: '把用神判断放回主客关系里。', do: ['看世是否持用神。', '看应用神是否被应爻持有。', '看世应生克合冲，判断我方与对方/事体的关系。'], output: '得到人和事之间是否配合。', fill: ['世是否持用神：是 / 否。', '应是否持用神：是 / 否。', '世应最后关系：有利 / 不利 / 互相牵制 / 暂时无关，因为____。'], knowledge: ['K05','K22','K02'] },
  { id: 12, title: '看卦象格局', desc: '用卦的整体状态辅助判断。', do: ['看本卦是否六合、六冲。', '看是否游魂、归魂。', '六合偏稳定、牵连、拖延；六冲偏变动、分散、冲开。', '格局只辅助，不覆盖用神旺衰和动变。'], output: '得到整体气势和背景。', fill: ['本卦属于：六合 / 六冲 / 游魂 / 归魂 / 普通。', '这个格局对本事的影响：稳定 / 冲散 / 反复 / 回归 / 其他____。'], knowledge: ['K23','K27'] },
  { id: 13, title: '看六神爻位', desc: '用六神和爻位补充细节，不直接定吉凶。', do: ['六神看象：青龙喜庆、朱雀口舌文书、勾陈阻滞田土、螣蛇虚惊怪异、白虎伤病压力、玄武隐私暗昧。', '爻位看上下、内外、远近、高低、时间层次。', '把象意用于解释，不要单独当裁判。'], output: '得到细节画像。', fill: ['用神临六神：____，象意是____。', '用神在第____爻，位置象意是____。', '这些象意支持/修正了前面的判断：____。'], knowledge: ['K24','K25','K08'] },
  { id: 14, title: '综合冲突', desc: '把矛盾信息按优先级排出来。', do: ['先看用神与世应。', '再看月日旺衰、空破墓绝。', '再看动变、原忌仇。', '最后才看六神、爻位、卦辞爻辞。', '遇到冲突，写清楚哪个信息是主裁判，哪个只是辅助象。'], output: '得到可以站得住的吉凶结论。', fill: ['最有利的信息是：____。', '最不利的信息是：____。', '最后取舍依据是：____。'], knowledge: ['K27','K29','K02','K10','K15'] },
  { id: 15, title: '定应期与断语', desc: '把判断变成一句可执行的结论。', do: ['先说成败吉凶，再说原因。', '再说应期：出空、冲合、值日、动爻变爻、病处得解之时。', '最后给建议：现在做、等、避开、补条件。'], output: '得到最终断语。', fill: ['结论：成 / 不成 / 暂缓 / 反复 / 需条件。', '关键原因：____。', '可能应期：____。', '建议：____。'], knowledge: ['K28','K13','K06','K27'] }
];

const KNOWLEDGE = [
  { id:'K01', title:'六亲基础', brief:'父母、兄弟、子孙、妻财、官鬼是六爻判断的角色系统。', body:['父母：文书、证件、房屋、车船、长辈、保护、消息凭据。','兄弟：同类、竞争者、朋友、破财、分财、阻力。','子孙：结果、享受、孩子、解忧、医药、技术、客户体验，也克官鬼。','妻财：钱财、货物、妻子/伴侣中的财象、资源、收入、可得之物。','官鬼：工作、职位、压力、病、官司、规则、丈夫/男方、风险。','取六亲时先看占事，不要按字面机械套。'], steps:[2,4,13] },
  { id:'K02', title:'用神取法', brief:'用神是本卦最核心的判断对象。', body:['求财取妻财；求工作职位取官鬼；考试证书文书取父母；疾病看官鬼为病、子孙为药；失物多取财或具体物象；婚恋根据问题取官鬼/妻财/世应。','同一卦可以有多个参考点，但主用神只能先定一个。','主用神定错，后面的旺衰、动变都会跟着错。'], steps:[1,4,11,14] },
  { id:'K03', title:'用神两现', brief:'同一种用神出现两个以上时，要分主次。', body:['优先级常见顺序：发动者优先；临世应者优先；旺相有气者优先；与月日关系强者优先；贴近占事位置者优先。','两现不等于两个都一样重要。一个主判断，一个可作副线索。','若一个旺而静、一个弱而动，要结合动爻是否有力，不能只看“动”一个条件。'], steps:[5] },
  { id:'K04', title:'伏神飞神', brief:'用神不上卦时，要看伏神是否被飞神压住。', body:['伏神：藏在本爻下面的神，表示事情有但不显、被藏、未出现。','飞神：伏神上面的明爻，像盖在伏神上的门。','飞神生伏神，伏神较易出；飞神克伏神，事情被压住；伏神得月日生扶，也可待时而出。','伏神空破墓绝时，即使有伏也难成。'], steps:[5] },
  { id:'K05', title:'世应用法', brief:'世是我方，应是对方或事情面对的外部对象。', body:['世爻代表求测者、自己、我方、当前处境。','应爻代表对方、目标、客户、单位、环境、事件对象。','世持用神：事情和自己贴身，自己掌控度高。应持用神：事情在对方或外部手里。','世应相生相合多有连接；相克相冲多有矛盾、阻隔或变化。'], steps:[2,3,11] },
  { id:'K06', title:'五行生克冲合', brief:'这是六爻所有作用关系的底层语言。', body:['相生：木生火、火生土、土生金、金生水、水生木。','相克：木克土、土克水、水克火、火克金、金克木。','六合：子丑、寅亥、卯戌、辰酉、巳申、午未。合有牵住、结合、拖住、成局之象。','六冲：子午、丑未、寅申、卯酉、辰戌、巳亥。冲有动、散、破、开、变化之象。','判断时要看谁有力，弱爻冲克旺爻，未必能成事。'], steps:[8,10,15] },
  { id:'K07', title:'原神、忌神、仇神', brief:'围绕用神找帮助和阻碍。', body:['原神：生用神者，是帮助事情成功的力量。','忌神：克用神者，是直接阻碍或伤害事情的力量。','仇神：生忌神、克原神者，是间接阻碍。','原神旺动来生用神为吉；忌神旺动来克用神为凶；忌神空破无力，阻碍减轻。'], steps:[10] },
  { id:'K08', title:'六亲人物象', brief:'六亲还可代表人物和社会关系。', body:['父母：父母长辈、老师、领导中的保护/文书面、房东、证件机构。','兄弟：朋友、同事、同行、竞争者、分财者。','子孙：孩子、下属、客户、学生、医生药物、娱乐放松。','妻财：妻子、女友、客户付款方、财物、货物。','官鬼：丈夫、男友、上级、官府、疾病、压力、规则。','人物象要和占事结合，不要脱离问题乱套。'], steps:[4,13] },
  { id:'K09', title:'旺相休囚死', brief:'判断爻有没有季节根气。', body:['得令为旺，受生为相，泄气为休，受克为囚，无气为死。','旺不一定吉，凶神旺也凶；弱不一定凶，忌神弱反而好。','旺衰是力量判断，不是吉凶标签。'], steps:[6] },
  { id:'K10', title:'月建日辰', brief:'月日是判断力量的主裁判之一。', body:['月建像大环境、季节、长期气候。','日辰像当天的执行力量、眼前状态、即时触发。','月生日生，用神得扶；月克日克，用神受压。','临月临日说明力量贴身明显。'], steps:[2,6,14] },
  { id:'K11', title:'月破日破', brief:'被月冲为月破，被日冲为日破。', body:['月破通常比日破更重，表示大环境破败、根基受损。','日破偏眼前被冲破、当天不稳。','用神月破而无救，事情多难；但若发动、得合、出月或有救，也要具体看。'], steps:[6,7] },
  { id:'K12', title:'长生墓绝', brief:'看爻处在生命过程的哪一段。', body:['长生表示生发、开始、有来源。','墓表示收藏、入库、被困、归藏。','绝表示气尽、断绝、难以发挥。','财入墓可能是钱被锁住；病入墓有时是病被收，但也要看用神和占事。'], steps:[6,7] },
  { id:'K13', title:'旬空、出空、冲空、填实', brief:'空表示暂时不实、不显、不落实。', body:['旬空不是永远没有，常表示暂时空、未到、未落实。','出空：过了旬空时间后有机会显现。','冲空：被冲动，有时能把空冲出来。','填实：值日值月或被合冲使其落实。','用神空，要问：有没有出空机会？有没有动爻生扶？有没有被冲实？'], steps:[2,7,15] },
  { id:'K14', title:'合住、入墓、绝地', brief:'这是常见“事情卡住”的原因。', body:['合住：被合牵住，不一定坏，但容易拖延、受牵制。','入墓：被收进库里，难以外显，需冲墓或开墓。','绝地：气尽无力，若用神临绝而无救，多主难成。','判断时要问：是谁被合、被墓、被绝？是用神、世爻，还是忌神？'], steps:[7] },
  { id:'K15', title:'动爻作用', brief:'动爻是卦里主动发力的一方。', body:['动爻可以生、克、冲、合用神或世应。','动爻代表变化、行动、事件发起点。','动爻不一定都重要，先看它是否作用到用神、世爻、应爻。','动爻发动但空破休囚，作用会打折。'], steps:[8,10,14] },
  { id:'K16', title:'动爻有力无力', brief:'不是动了就能成事。', body:['动爻得月日生扶、旺相、临日月、有原神助，多为有力。','动爻空、破、休囚、入墓、被合住，多为无力或暂缓。','旺动克用神，阻碍强；弱动克用神，阻碍轻。'], steps:[5,8,10] },
  { id:'K17', title:'多动爻主次', brief:'多动时先找主线，不要平均看。', body:['优先看直接作用用神、世、应的动爻。','其次看发动后化出的变爻是否重要。','再看动爻之间是否互相生克冲合。','主线动爻决定大方向，其他动爻补充细节。'], steps:[5,8] },
  { id:'K18', title:'变爻意义', brief:'变爻表示动爻变化后的状态和结果。', body:['动爻是现在发动，变爻是变化后的落点。','看变爻是否回头生克原动爻。','看变爻是否让事情进、退、空、破、墓、合、冲。'], steps:[9] },
  { id:'K19', title:'回头生、回头克', brief:'动爻化出变爻后，变爻反过来作用动爻。', body:['回头生：变化之后反而得到补充，多有后劲。','回头克：变化之后反受伤，多主反复、后患、变坏。','判断回头生克时，也要看变爻是否空破无力。'], steps:[9] },
  { id:'K20', title:'化进神、化退神', brief:'事情力量向前还是向后。', body:['化进神：力量推进、发展、加深。','化退神：力量退缩、减弱、反复或撤回。','用神化进多利推进；忌神化进则阻力增强。','用神化退多不利；忌神化退则阻力减轻。'], steps:[9] },
  { id:'K21', title:'化空、化破、化墓、化合、化冲', brief:'变爻的特殊落点。', body:['化空：变化后落空，暂不落实。','化破：变化后受破，结果不稳。','化墓：变化后被收住、藏住、卡住。','化合：变化后被牵连、合住、成关系，也可能拖住。','化冲：变化后被冲开、冲散、冲动。'], steps:[9] },
  { id:'K22', title:'世应生克合冲', brief:'看我方和对方/事体是否相合。', body:['世生应：我方付出、我去求对方。','应生世：对方帮我、事体来就我。','世克应：我方压制对方，未必顺。','应克世：外界压我，对我不利。','世应合：有连接、合作、牵挂；世应冲：分离、冲突、变动。'], steps:[3,11] },
  { id:'K23', title:'六合、六冲、游魂、归魂', brief:'整体卦象气势。', body:['六合卦：稳定、牵连、合住、拖延、关系紧。','六冲卦：冲散、变化、急、破局、分离。','游魂卦：心不定、事漂浮、外游、反复。','归魂卦：回归、收束、回头、旧事重来。','格局只能辅助，不能覆盖用神、月日、动变。'], steps:[4,12] },
  { id:'K24', title:'六神象意', brief:'六神用于补充细节和象，不作主裁判。', body:['青龙：喜庆、酒食、顺利、漂亮、体面。','朱雀：口舌、消息、文书、电话、考试表达。','勾陈：拖延、田土、旧事、阻滞、固定。','螣蛇：虚惊、怪异、纠结、梦、想象。','白虎：伤病、压力、凶险、刀血、严厉。','玄武：隐私、暗昧、欺瞒、偷盗、暧昧。'], steps:[2,13] },
  { id:'K25', title:'爻位上下内外远近', brief:'爻位帮助判断空间、层次和时间远近。', body:['初爻偏下、内、近、基础、脚下。','二爻偏家宅、内部、身体下部、基层。','三爻为内外交界，常见变化和阻隔。','四爻偏外部、门外、过程。','五爻偏高位、领导、核心、远处。','上爻偏终点、远、外、高、结束。'], steps:[3,13] },
  { id:'K26', title:'卦辞爻辞', brief:'适合辅助理解卦意，不作为纳甲六爻主裁判。', body:['卦辞爻辞可帮助理解象和人事语境。','纳甲六爻判断成败，仍以用神、世应、月日、动变为空破等为主。','新手不要先读卦辞，否则容易跳过用神和旺衰。'], steps:[14] },
  { id:'K27', title:'冲突处理优先级', brief:'信息矛盾时按层级取舍。', body:['第一层：占事与用神是否取准。','第二层：世应主客是否清楚。','第三层：月日旺衰、空破墓绝。','第四层：动爻变爻、原忌仇。','第五层：格局、六神、爻位、卦辞爻辞。','主裁判和辅助象冲突时，以主裁判为准。'], steps:[12,14,15] },
  { id:'K28', title:'应期', brief:'应期看病处何时被解决，或用神何时有力。', body:['空者看出空、冲空、填实。','破者看合破、出月、值日。','墓者看冲墓、开墓。','合住者看冲开；冲散者看合住或值日。','动爻和变爻的地支常是应期线索。'], steps:[15] },
  { id:'K29', title:'资料权重', brief:'纳甲六爻为主干，古法为规则，现代体系作流程和分类。', body:['主裁判：纳甲六爻 / 文王卦 / 火珠林主干，包括六亲、世应、用神、月日、动变、生克冲合、旬空月破。','主规则来源：增删卜易、卜筮正宗、黄金策等古法资料，提供病药、得失、应期等经典准则。','流程与优先级：朱辰彬体系，用于判断顺序、冲突处理、实战取舍。','现代占事模板：王虎应体系，用于求财、婚姻、疾病、考试、失物等分类规则。','辅助解释：易理卦象、卦辞爻辞、六神爻位，只用于解释润色，不覆盖主裁判。'], steps:[1,14] }
];

const STORE_KEY = 'liuyao_pwa_records_v1';
const SETTINGS_KEY = 'liuyao_pwa_settings_v1';
const CURRENT_KEY = 'liuyao_pwa_current_record_id_v1';
const CLOUD_FILE = 'liuyao-pwa-notes.json';

let state = {
  records: [],
  settings: { token: '', gistId: '', lastSync: '' },
  currentRecordId: '',
  search: ''
};

function qs(sel, root=document) { return root.querySelector(sel); }
function qsa(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }
function escapeHtml(str='') { return String(str).replace(/[&<>'"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[s])); }
function nowIso() { return new Date().toISOString(); }
function formatDate(iso) { if (!iso) return ''; const d = new Date(iso); return d.toLocaleString('zh-CN', { hour12:false }); }
function todayId() { const d = new Date(); return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`; }
function makeId() {
  const date = todayId();
  const todayCount = state.records.filter(r => r.id.startsWith(`LY-${date}`)).length + 1;
  return `LY-${date}-${String(todayCount).padStart(3,'0')}`;
}
function saveLocal() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state.records));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  localStorage.setItem(CURRENT_KEY, state.currentRecordId || '');
  updateHeader();
}
function loadLocal() {
  try { state.records = JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { state.records = []; }
  try { state.settings = { ...state.settings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')) }; } catch {}
  state.currentRecordId = localStorage.getItem(CURRENT_KEY) || (state.records[0]?.id || '');
}
function currentRecord() { return state.records.find(r => r.id === state.currentRecordId); }
function ensureRecord() {
  if (currentRecord()) return currentRecord();
  if (!state.records.length) return null;
  state.currentRecordId = state.records[0].id;
  saveLocal();
  return currentRecord();
}
function newRecord(title='', question='') {
  const id = makeId();
  const r = {
    id,
    title: title.trim() || `读盘笔记 ${id}`,
    question: question.trim(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    tags: [],
    steps: {},
    final: {}
  };
  STEPS.forEach(s => r.steps[s.id] = { conclusion:'', evidence:'', doubt:'', note:'', fills: Array(s.fill.length).fill('') });
  state.records.unshift(r);
  state.currentRecordId = id;
  saveLocal();
  return r;
}
function touchRecord(r) { r.updatedAt = nowIso(); saveLocal(); }
function updateHeader() {
  const r = currentRecord();
  qs('#currentRecordLabel').textContent = r ? `${r.id} · ${r.title}` : '未选择记录';
}
function setActiveTab() {
  const hash = location.hash || '#home';
  qsa('.bottom-nav a').forEach(a => a.classList.toggle('active', hash.startsWith(`#${a.dataset.tab}`) || (a.dataset.tab === 'home' && hash.startsWith('#step-'))));
}
function go(hash) { location.hash = hash; }

function render() {
  const app = qs('#app');
  setActiveTab();
  updateHeader();
  const hash = location.hash || '#home';
  if (hash.startsWith('#step-')) return renderStep(Number(hash.replace('#step-','')));
  if (hash.startsWith('#knowledge-')) return renderKnowledgeDetail(hash.replace('#knowledge-',''));
  if (hash === '#records') return renderRecords();
  if (hash === '#knowledge') return renderKnowledgeList();
  if (hash === '#summary') return renderSummary();
  if (hash === '#settings') return renderSettings();
  return renderHome();
}

function renderHome() {
  const app = qs('#app');
  const r = ensureRecord();
  app.innerHTML = `
    <section class="card hero">
      <h1>15 步读盘流程</h1>
      <p>从网页排盘开始，一步一步填。每步笔记会自动保存，最后汇总成断语。</p>
      <p class="small">当前笔记：${r ? `${escapeHtml(r.id)} · ${escapeHtml(r.title)}` : '未选择'}</p>
      <div class="button-row">
        <a href="#records" class="secondary-btn">新建 / 切换笔记</a>
        <a href="#summary" class="secondary-btn">查看自动汇总</a>
      </div>
    </section>
    <section class="card compact">
      <div class="kicker">资料权重</div>
      <p><b>主裁判：</b>纳甲六爻 / 文王卦 / 火珠林。先看六亲、世应、用神、月日、动变、生克冲合、旬空月破。</p>
      <p><b>辅助：</b>古法规则、朱辰彬流程优先级、王虎应现代分类、六神爻位卦象解释。</p>
      <a class="knowledge-chip" href="#knowledge-K29">查看资料权重详细说明</a>
    </section>
    <section class="step-list">
      ${STEPS.map(s => `
        <a class="step-card" href="#step-${s.id}">
          <div class="step-no">${s.id}</div>
          <div><div class="step-title">${escapeHtml(s.title)}</div><div class="step-desc">${escapeHtml(s.desc)}</div></div>
          <div class="chev">›</div>
        </a>
      `).join('')}
    </section>
    <div class="footer-space"></div>
  `;
}

function recordNeededHtml() {
  return document.getElementById('emptyTemplate').innerHTML;
}

function renderStep(stepId) {
  const app = qs('#app');
  const step = STEPS.find(s => s.id === stepId) || STEPS[0];
  const r = ensureRecord();
  if (!r) { app.innerHTML = recordNeededHtml(); return; }
  if (!r.steps[step.id]) r.steps[step.id] = { conclusion:'', evidence:'', doubt:'', note:'', fills: Array(step.fill.length).fill('') };
  const data = r.steps[step.id];
  app.innerHTML = `
    <section class="card">
      <div class="kicker">第 ${step.id} 步</div>
      <h1>${escapeHtml(step.title)}</h1>
      <p>${escapeHtml(step.desc)}</p>
      <div class="callout ok"><b>本步产出：</b>${escapeHtml(step.output)}</div>
      <h3>本步要做什么</h3>
      <ol>${step.do.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ol>
      <h3>本步知识点</h3>
      <div class="tag-row">
        ${step.knowledge.map(kid => {
          const k = KNOWLEDGE.find(x => x.id === kid);
          return `<a class="knowledge-chip" href="#knowledge-${kid}">${escapeHtml(k?.title || kid)}</a>`;
        }).join('')}
      </div>
    </section>

    <section class="card">
      <h2>本步填空</h2>
      <p class="small">填空用于强迫自己把盘面证据写出来，避免只凭感觉断。</p>
      ${step.fill.map((prompt, i) => `
        <div class="fill-card">
          <label>${escapeHtml(prompt)}</label>
          <input type="text" data-step-field="fill" data-index="${i}" value="${escapeHtml(data.fills?.[i] || '')}" placeholder="点这里填写" />
        </div>
      `).join('')}
    </section>

    <section class="card">
      <h2>本步笔记</h2>
      <label>本步结论</label>
      <input type="text" data-step-field="conclusion" value="${escapeHtml(data.conclusion || '')}" placeholder="例如：用神妻财两现，以发动临应者为主" />
      <label>盘面证据</label>
      <textarea data-step-field="evidence" placeholder="把月日、动变、空破等证据写在这里">${escapeHtml(data.evidence || '')}</textarea>
      <label>疑点 / 待复核</label>
      <textarea data-step-field="doubt" placeholder="例如：用神空，但被日冲，需判断是否冲空">${escapeHtml(data.doubt || '')}</textarea>
      <label>自由笔记</label>
      <textarea class="note-area" data-step-field="note" placeholder="你的理解、老师说法、案例对照等">${escapeHtml(data.note || '')}</textarea>
    </section>

    <section class="card compact">
      <div class="button-row">
        ${step.id > 1 ? `<a class="secondary-btn" href="#step-${step.id - 1}">上一步</a>` : ''}
        ${step.id < STEPS.length ? `<a class="primary-btn" href="#step-${step.id + 1}">下一步</a>` : `<a class="primary-btn" href="#summary">去汇总</a>`}
        <a class="ghost-btn" href="#home">回流程总表</a>
      </div>
    </section>
  `;
  qsa('[data-step-field]').forEach(el => {
    el.addEventListener('input', () => {
      const rr = currentRecord();
      const st = rr.steps[step.id];
      const field = el.dataset.stepField;
      if (field === 'fill') {
        const idx = Number(el.dataset.index);
        if (!Array.isArray(st.fills)) st.fills = Array(step.fill.length).fill('');
        st.fills[idx] = el.value;
      } else {
        st[field] = el.value;
      }
      touchRecord(rr);
    });
  });
}

function renderRecords() {
  const app = qs('#app');
  app.innerHTML = `
    <section class="card">
      <h1>读盘笔记</h1>
      <p>每一次占事是一条独立笔记。系统自动编号，也可以自己改名字。</p>
      <div class="form-block">
        <label>新笔记名称</label>
        <input id="newTitle" type="text" placeholder="例如：找钥匙 / 面试结果 / 求财" />
        <label>问题原文</label>
        <textarea id="newQuestion" placeholder="例如：今天丢的钥匙能不能找回来？"></textarea>
        <button class="primary-btn full" id="createRecordBtn">新建读盘笔记</button>
      </div>
    </section>
    <section class="card">
      <h2>已有笔记</h2>
      <div class="grid">
        ${state.records.length ? state.records.map(r => recordCardHtml(r)).join('') : '<p class="small">还没有笔记。</p>'}
      </div>
    </section>
  `;
  qs('#createRecordBtn').addEventListener('click', () => {
    const title = qs('#newTitle').value;
    const question = qs('#newQuestion').value;
    const r = newRecord(title, question);
    go(`#step-1`);
  });
  qsa('[data-select-record]').forEach(btn => btn.addEventListener('click', () => { state.currentRecordId = btn.dataset.selectRecord; saveLocal(); renderRecords(); }));
  qsa('[data-rename-record]').forEach(btn => btn.addEventListener('click', () => renameRecord(btn.dataset.renameRecord)));
  qsa('[data-duplicate-record]').forEach(btn => btn.addEventListener('click', () => duplicateRecord(btn.dataset.duplicateRecord)));
  qsa('[data-delete-record]').forEach(btn => btn.addEventListener('click', () => deleteRecord(btn.dataset.deleteRecord)));
}
function recordCardHtml(r) {
  const selected = r.id === state.currentRecordId;
  return `
    <div class="record-card">
      <div class="record-id">${escapeHtml(r.id)} ${selected ? '· 当前' : ''}</div>
      <div class="record-title">${escapeHtml(r.title)}</div>
      <div class="small">更新：${escapeHtml(formatDate(r.updatedAt))}</div>
      <div class="small">问题：${escapeHtml(r.question || '未填写')}</div>
      <div class="record-actions">
        <button class="${selected ? 'secondary-btn' : 'primary-btn'}" data-select-record="${escapeHtml(r.id)}">${selected ? '已选中' : '切换'}</button>
        <button class="secondary-btn" data-rename-record="${escapeHtml(r.id)}">改名</button>
        <button class="secondary-btn" data-duplicate-record="${escapeHtml(r.id)}">复制</button>
        <button class="danger-btn" data-delete-record="${escapeHtml(r.id)}">删除</button>
      </div>
    </div>
  `;
}
function renameRecord(id) {
  const r = state.records.find(x => x.id === id);
  if (!r) return;
  const name = prompt('输入新的笔记名称：', r.title);
  if (name === null) return;
  r.title = name.trim() || r.title;
  touchRecord(r);
  renderRecords();
}
function duplicateRecord(id) {
  const r = state.records.find(x => x.id === id);
  if (!r) return;
  const copy = JSON.parse(JSON.stringify(r));
  copy.id = makeId();
  copy.title = `${r.title} - 复制`;
  copy.createdAt = nowIso();
  copy.updatedAt = nowIso();
  state.records.unshift(copy);
  state.currentRecordId = copy.id;
  saveLocal();
  renderRecords();
}
function deleteRecord(id) {
  const r = state.records.find(x => x.id === id);
  if (!r) return;
  if (!confirm(`确定删除 ${r.id} · ${r.title}？删除前建议先导出或同步。`)) return;
  state.records = state.records.filter(x => x.id !== id);
  if (state.currentRecordId === id) state.currentRecordId = state.records[0]?.id || '';
  saveLocal();
  renderRecords();
}

function renderKnowledgeList() {
  const app = qs('#app');
  const list = KNOWLEDGE.filter(k => !state.search || `${k.title} ${k.brief} ${k.body.join('')}`.includes(state.search));
  app.innerHTML = `
    <section class="card">
      <h1>知识库</h1>
      <p>点大按钮进入知识卡。知识卡会反向显示“用于哪些步骤”。</p>
      <input class="search-box" id="knowledgeSearch" type="text" value="${escapeHtml(state.search)}" placeholder="搜索：用神、旬空、月破、动爻……" />
    </section>
    <section class="knowledge-list">
      ${list.map(k => `
        <a class="knowledge-card" href="#knowledge-${k.id}">
          <div class="knowledge-title">${escapeHtml(k.title)}</div>
          <div class="knowledge-desc">${escapeHtml(k.brief)}</div>
        </a>`).join('')}
    </section>
  `;
  qs('#knowledgeSearch').addEventListener('input', e => { state.search = e.target.value.trim(); renderKnowledgeList(); });
}
function renderKnowledgeDetail(kid) {
  const app = qs('#app');
  const k = KNOWLEDGE.find(x => x.id === kid) || KNOWLEDGE[0];
  app.innerHTML = `
    <section class="card">
      <div class="kicker">知识卡 ${escapeHtml(k.id)}</div>
      <h1>${escapeHtml(k.title)}</h1>
      <p>${escapeHtml(k.brief)}</p>
      <div class="callout"><b>用于步骤：</b><div class="tag-row">${k.steps.map(sid => `<a class="knowledge-chip" href="#step-${sid}">第 ${sid} 步：${escapeHtml(STEPS.find(s => s.id === sid)?.title || '')}</a>`).join('')}</div></div>
      <h3>零基础解释</h3>
      <ul>${k.body.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
    </section>
    <section class="card compact">
      <div class="button-row">
        <a class="secondary-btn" href="#knowledge">回知识库</a>
        <a class="ghost-btn" href="#home">回流程总表</a>
      </div>
    </section>
  `;
}

function renderSummary() {
  const app = qs('#app');
  const r = ensureRecord();
  if (!r) { app.innerHTML = recordNeededHtml(); return; }
  app.innerHTML = `
    <section class="card">
      <h1>自动汇总</h1>
      <div class="record-id">${escapeHtml(r.id)}</div>
      <h2>${escapeHtml(r.title)}</h2>
      <p><b>问题：</b>${escapeHtml(r.question || '未填写')}</p>
      <p class="small">创建：${escapeHtml(formatDate(r.createdAt))}；更新：${escapeHtml(formatDate(r.updatedAt))}</p>
      <div class="button-row">
        <button class="secondary-btn" id="copySummaryBtn">复制断语草稿</button>
        <button class="secondary-btn" id="exportJsonBtn">导出 JSON</button>
        <button class="secondary-btn" id="exportTxtBtn">导出 TXT</button>
      </div>
    </section>

    <section class="card">
      <h2>最终断语模板</h2>
      ${finalField('verdict','结论','例如：此事可成，但先难后易 / 暂不成，需等出空')}
      ${finalField('reason','关键原因','例如：用神得日生但旬空，动爻化进，待出空后有力')}
      ${finalField('timing','应期','例如：出空之日、冲墓之日、用神值日')}
      ${finalField('advice','建议','例如：先等消息，不宜当天强推；某日后再行动')}
    </section>

    <section class="card">
      <h2>15 步记录汇总</h2>
      <div class="summary-scroll">
        <table class="summary-table">
          <thead><tr><th>步骤</th><th>结论</th><th>证据</th><th>疑点</th></tr></thead>
          <tbody>${STEPS.map(s => {
            const st = r.steps?.[s.id] || {};
            return `<tr><td>${s.id}. ${escapeHtml(s.title)}</td><td>${escapeHtml(st.conclusion || '')}</td><td>${escapeHtml(st.evidence || '')}</td><td>${escapeHtml(st.doubt || '')}</td></tr>`;
          }).join('')}</tbody>
        </table>
      </div>
    </section>
  `;
  qsa('[data-final-field]').forEach(el => el.addEventListener('input', () => { const rr = currentRecord(); rr.final[el.dataset.finalField] = el.value; touchRecord(rr); }));
  qs('#copySummaryBtn').addEventListener('click', copySummary);
  qs('#exportJsonBtn').addEventListener('click', () => downloadFile(`${r.id}.json`, JSON.stringify(r, null, 2), 'application/json'));
  qs('#exportTxtBtn').addEventListener('click', () => downloadFile(`${r.id}.txt`, buildSummaryText(r), 'text/plain'));
}
function finalField(key, label, placeholder) {
  const r = currentRecord();
  return `<label>${escapeHtml(label)}</label><textarea data-final-field="${key}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(r.final?.[key] || '')}</textarea>`;
}
function buildSummaryText(r) {
  const lines = [];
  lines.push(`# ${r.id} · ${r.title}`);
  lines.push(`问题：${r.question || ''}`);
  lines.push(`创建：${formatDate(r.createdAt)}  更新：${formatDate(r.updatedAt)}`);
  lines.push('');
  lines.push('## 最终断语');
  lines.push(`结论：${r.final?.verdict || ''}`);
  lines.push(`原因：${r.final?.reason || ''}`);
  lines.push(`应期：${r.final?.timing || ''}`);
  lines.push(`建议：${r.final?.advice || ''}`);
  lines.push('');
  lines.push('## 15 步记录');
  STEPS.forEach(s => {
    const st = r.steps?.[s.id] || {};
    lines.push(`${s.id}. ${s.title}`);
    lines.push(`- 结论：${st.conclusion || ''}`);
    lines.push(`- 证据：${st.evidence || ''}`);
    lines.push(`- 疑点：${st.doubt || ''}`);
    lines.push(`- 笔记：${st.note || ''}`);
    lines.push('');
  });
  return lines.join('\n');
}
async function copySummary() {
  const r = currentRecord();
  const text = buildSummaryText(r);
  try { await navigator.clipboard.writeText(text); alert('已复制断语草稿'); }
  catch { alert('复制失败，可以导出 TXT。'); }
}
function downloadFile(filename, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function renderSettings() {
  const app = qs('#app');
  app.innerHTML = `
    <section class="card">
      <h1>同步与安装</h1>
      <p>本工具先自动保存到本机浏览器。要“长期保存在 web 里”，可以用 GitHub Gist 云端笔记库。</p>
      <div class="callout warn"><b>注意：</b>GitHub Pages 是静态网页，本身不能保存数据库。这里用 GitHub Gist 作为云端 JSON 笔记库。</div>
    </section>

    <section class="card">
      <h2>GitHub Gist 云同步</h2>
      <label>GitHub Token</label>
      <input id="tokenInput" type="password" value="${escapeHtml(state.settings.token || '')}" placeholder="粘贴有 gist 权限的 token" />
      <label>Gist ID</label>
      <input id="gistInput" type="text" value="${escapeHtml(state.settings.gistId || '')}" placeholder="创建后自动填入，也可以手动粘贴" />
      <div class="button-row">
        <button class="primary-btn" id="createCloudBtn">创建云端笔记库</button>
        <button class="secondary-btn" id="syncCloudBtn">同步：合并本机与云端</button>
        <button class="secondary-btn" id="pushCloudBtn">只上传本机</button>
        <button class="secondary-btn" id="pullCloudBtn">只读取云端</button>
      </div>
      <p class="small">最后同步：${escapeHtml(state.settings.lastSync ? formatDate(state.settings.lastSync) : '未同步')}</p>
      <div id="syncStatus" class="small"></div>
    </section>

    <section class="card">
      <h2>备份</h2>
      <div class="button-row">
        <button class="secondary-btn" id="exportAllBtn">导出全部笔记 JSON</button>
        <label class="secondary-btn" for="importAllInput">导入 JSON</label>
        <input class="hidden" id="importAllInput" type="file" accept="application/json,.json" />
      </div>
    </section>

    <section class="card">
      <h2>安装成手机 App</h2>
      <ol>
        <li>把本项目发布到 GitHub Pages。</li>
        <li>用 Safari 或 Chrome 打开网页地址。</li>
        <li>选择“添加到主屏幕”。</li>
        <li>以后从桌面图标打开，离线也能查看流程和本机笔记。</li>
      </ol>
    </section>
  `;
  qs('#tokenInput').addEventListener('input', e => { state.settings.token = e.target.value.trim(); saveLocal(); });
  qs('#gistInput').addEventListener('input', e => { state.settings.gistId = e.target.value.trim(); saveLocal(); });
  qs('#createCloudBtn').addEventListener('click', createCloudNotebook);
  qs('#syncCloudBtn').addEventListener('click', syncCloud);
  qs('#pushCloudBtn').addEventListener('click', pushCloud);
  qs('#pullCloudBtn').addEventListener('click', pullCloud);
  qs('#exportAllBtn').addEventListener('click', () => downloadFile('liuyao-all-notes.json', JSON.stringify(cloudPayload(), null, 2), 'application/json'));
  qs('#importAllInput').addEventListener('change', importAllJson);
}
function status(msg, type='') {
  const el = qs('#syncStatus');
  if (el) el.innerHTML = `<div class="callout ${type}">${escapeHtml(msg)}</div>`;
}
function cloudPayload() {
  return { version: 1, app: 'liuyao-pwa', updatedAt: nowIso(), records: state.records };
}
async function githubRequest(url, options={}) {
  if (!state.settings.token) throw new Error('缺少 GitHub Token');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${state.settings.token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!res.ok) throw new Error(`GitHub 请求失败：${res.status} ${await res.text()}`);
  return res.json();
}
async function createCloudNotebook() {
  try {
    status('正在创建云端笔记库……');
    const body = {
      description: 'liuyao-pwa-notes',
      public: false,
      files: { [CLOUD_FILE]: { content: JSON.stringify(cloudPayload(), null, 2) } }
    };
    const data = await githubRequest('https://api.github.com/gists', { method:'POST', body: JSON.stringify(body) });
    state.settings.gistId = data.id;
    state.settings.lastSync = nowIso();
    saveLocal();
    renderSettings();
    setTimeout(() => status(`已创建云端笔记库：${data.id}`, 'ok'), 50);
  } catch (e) { status(e.message, 'danger'); }
}
async function fetchCloudPayload() {
  if (!state.settings.gistId) throw new Error('缺少 Gist ID');
  const data = await githubRequest(`https://api.github.com/gists/${state.settings.gistId}`, { method:'GET' });
  const content = data.files?.[CLOUD_FILE]?.content;
  if (!content) throw new Error(`云端没有 ${CLOUD_FILE}`);
  return JSON.parse(content);
}
async function pushCloud() {
  try {
    if (!state.settings.gistId) throw new Error('缺少 Gist ID。可以先点“创建云端笔记库”。');
    status('正在上传本机笔记……');
    const body = { files: { [CLOUD_FILE]: { content: JSON.stringify(cloudPayload(), null, 2) } } };
    await githubRequest(`https://api.github.com/gists/${state.settings.gistId}`, { method:'PATCH', body: JSON.stringify(body) });
    state.settings.lastSync = nowIso();
    saveLocal();
    status('已上传到云端。', 'ok');
  } catch (e) { status(e.message, 'danger'); }
}
async function pullCloud() {
  try {
    status('正在读取云端笔记……');
    const payload = await fetchCloudPayload();
    if (!Array.isArray(payload.records)) throw new Error('云端文件格式不正确');
    state.records = payload.records;
    state.currentRecordId = state.records[0]?.id || '';
    state.settings.lastSync = nowIso();
    saveLocal();
    status('已读取云端并覆盖本机。', 'ok');
    setTimeout(renderSettings, 500);
  } catch (e) { status(e.message, 'danger'); }
}
function mergeRecords(localRecords, cloudRecords) {
  const map = new Map();
  [...cloudRecords, ...localRecords].forEach(r => {
    const old = map.get(r.id);
    if (!old || new Date(r.updatedAt || 0) >= new Date(old.updatedAt || 0)) map.set(r.id, r);
  });
  return Array.from(map.values()).sort((a,b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
}
async function syncCloud() {
  try {
    if (!state.settings.gistId) throw new Error('缺少 Gist ID。可以先点“创建云端笔记库”。');
    status('正在合并本机与云端……');
    const payload = await fetchCloudPayload();
    const merged = mergeRecords(state.records, payload.records || []);
    state.records = merged;
    if (!state.currentRecordId && merged[0]) state.currentRecordId = merged[0].id;
    saveLocal();
    await pushCloud();
    status(`同步完成。共 ${merged.length} 条笔记。`, 'ok');
  } catch (e) { status(e.message, 'danger'); }
}
function importAllJson(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const records = Array.isArray(data.records) ? data.records : (Array.isArray(data) ? data : []);
      if (!records.length) throw new Error('没有找到笔记 records');
      state.records = mergeRecords(state.records, records);
      state.currentRecordId = state.records[0]?.id || '';
      saveLocal();
      alert(`导入完成，共 ${state.records.length} 条笔记。`);
      renderSettings();
    } catch (err) { alert(`导入失败：${err.message}`); }
  };
  reader.readAsText(file);
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => {
  loadLocal();
  if (!state.records.length) newRecord('示例：第一次读盘练习', '在这里写本次占事问题。');
  if (!location.hash) location.hash = '#home';
  render();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
