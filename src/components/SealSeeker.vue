<template>
  <div class="adaptive-page">
    <!-- 页面标题 -->
    <el-row justify="center" class="title-row">
      <h1>汉印文字征查询</h1>
    </el-row>

    <!-- 搜索框和按钮 -->
    <el-row justify="center" class="seeker-row" :gutter="0">
      <el-col>
        <div class="search-container">
          <el-input
              v-model="seekerQuery"
              placeholder="请输入查询内容"
              clearable
          />
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="primary" @click="handleExhaust">拆分</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索选项 -->
    <el-row justify="center" class="seeker-options">
      <el-col :span="24">
        <div class="options-container" style="display: flex; gap: 10px; align-items: center;">
          <el-button type="primary" bg style="flex: 1;" @click="toggleKeyboard">部首键盘⌨</el-button>
          <el-checkbox-group v-model="checkList" style="flex: 4; display: flex; gap: 0;">
            <el-checkbox label="包含异体" size="large" value="variant" border></el-checkbox>
            <el-checkbox label="无理拆分" size="large" value="subdivide" border></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>

    <!-- 部首键盘区域 -->
    <el-row v-if="showKeyboard" justify="center" class="keyboard-row">
      <el-col :span="24">
        <div class="keyboard-container" style="padding: 10px; border: 1px solid #ccc; margin-top: 10px;">
          <el-row class="virtual-keyboard">
            <el-col :span="24" v-for="(stroke, index) in strokes" :key="index"
                    style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="width: 60px; text-align: right; margin-left: 10px;">{{ stroke.name }}</span>
              <div class="keyboard-row" style="flex: 1;">
                <el-button
                    v-for="(char, idx) in stroke.characters"
                    :key="idx"
                    size="small"
                    @click="handleKeyClick(char)"
                    style="margin: 0 5px;">
                  {{ char }}
                </el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 结果展示区 -->
    <el-row justify="center" class="results-row">
      <el-col :span="24">
        <el-card v-for="(item, index) in results" :key="index" class="result-card">
          <p>{{ item }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {exhaust} from "@/components/exhaust";

export default {
  data() {
    return {
      lq: '',
      seekerQuery: '',
      results: [],
      checkList: [],
      showKeyboard: false, // 控制部首键盘的显示状态
      strokes: [
        {
          name: "01畫",
          characters: ["一", "丨", "丶", "丿", "乙", "亅", "乚", "㇄", "㇁", "㇂", "𠄌", "𠃊", "𠃋", "𡿨", "乛", "㇇", "𠃍", "㇏", "乀", "⺄", "𠃌", "㇆", "㇉", "𠃑", "㇊", "㇒", "㇣", "㇀"]
        },
        {
          name: "02畫",
          characters: ["二", "亠", "人", "儿", "入", "八", "冂", "冖", "冫", "几", "凵", "刀", "力", "勹", "匕", "匚", "匸", "十", "卜", "卩", "厂", "厶", "又", "亻", "𠆢", "丷", "刂", "⺈", "㔾", "讠", "𢎘", "𠂉", "〢", "𠂊", "𠂇", "㐅", "乂", "𠘧", "𠘨", "⺆", "丂", "𠀁", "龴", "𠂆", "𠄎", "㇋", "㇌", "⺀", "𠂈", "丩", "⺊", "丄", "丅", "丆", "𠃎", "𠄟", "𠄠", "𠄐", "𠃏", "乁", "𠙴", "七", "𠤎", "九"]
        },
        {
          name: "03畫",
          characters: ["口", "囗", "土", "士", "夂", "夊", "夕", "大", "女", "子", "宀", "寸", "小", "尢", "尸", "屮", "山", "巛", "工", "己", "巾", "干", "幺", "广", "廴", "廾", "弋", "弓", "彐", "彡", "彳", "川", "⺌", "𡭔", "䶹", "彑", "忄", "扌", "氵", "犭", "⺾", "阝", "⻖", "⻏", "⺕", "⻌", "丬", "纟", "飞", "饣", "䒑", "卄", "𭕄", "𠀆", "𠔼", "𠫓", "𣥂", "𡳾", "𠂎", "乇", "𫝀", "㐄", "𡕒", "乡", "𠚤", "习", "亼", "三", "丈", "也", "于", "上", "下", "兀", "丌", "卂", "亇", "万", "刄"]
        },
        {
          name: "04畫",
          characters: ["心", "戈", "戶", "手", "支", "攴", "文", "斗", "斤", "方", "无", "日", "曰", "月", "木", "欠", "止", "歹", "殳", "毋", "比", "毛", "氏", "气", "水", "火", "爪", "父", "爻", "爿", "片", "牙", "牛", "犬", "⺗", "攵", "朩", "毌", "灬", "爫", "爫", "牜", "𠂒", "尣", "⺩", "礻", "龰", "罓", "冈", "㓁", "⺼", "艹", "辶", "⻍", "耂", "⺳", "𦉪", "𠔿", "⺝", "艹", "卝", "龷", "廿", "丰", "丯", "𧘇", "𣎳", "𥘅", "龶", "⺜", "厃", "𠃜", "肀", "旡", "冘", "夬", "兂", "龵", "𦉫", "𠬝", "㸦", "𤓰", "𠃛", "夨", "仌", "王", "五", "六", "卅", "不", "丐", "及", "丑", "丹", "刅", "井", "开", "𠬛", "尺", "巨", "巴", "𣎴", "冃", "冄", "𠬞", "𠬜", "丮", "巿", "𠃚"]
        },
        {
          name: "05畫",
          characters: ["玄", "玉", "瓜", "瓦", "甘", "生", "用", "田", "疋", "疒", "癶", "白", "皮", "皿", "目", "矛", "矢", "石", "示", "禸", "禾", "穴", "立", "𤴓", "𤴔", "罒", "𦉰", "歺", "母", "氺", "衤", "⺬", "钅", "𢆉", "𦍍", "业", "𠀎", "㠯", "𠕁", "𡗗", "圥", "𠮠", "犮", "𢎨", "𦘒", "⺻", "龸", "𣦵", "丱", "𤕫", "𥝌", "𦫳", "𣎵", "屵", "𫇦", "四", "卌", "夗", "㐱", "乍", "乎", "冉", "册", "史", "央", "戉", "戊", "冋", "本", "民", "永", "北"]
        },
        {
          name: "06畫",
          characters: ["竹", "米", "糸", "缶", "网", "羊", "羽", "老", "而", "耒", "耳", "聿", "肉", "臣", "自", "至", "臼", "舌", "舛", "舟", "艮", "色", "艸", "虍", "虫", "血", "行", "衣", "襾", "𥫗", "糹", "𦍌", "⺶", "西", "覀", "齐", "冎", "龹", "𠂤", "𧰨", "乑", "𢦏", "产", "巩", "𦈢", "𠂭", "𠂢", "𠦃", "䇂", "㐆", "甶", "囟", "幵", "厽", "𠃨", "𠬪", "朿", "亙", "兆", "州", "年", "曲", "曳", "朱", "关"]
        },
        {
          name: "07畫",
          characters: ["見", "角", "言", "谷", "豆", "豕", "豸", "貝", "赤", "走", "足", "身", "車", "辛", "辰", "辵", "邑", "酉", "釆", "里", "訁", "𧮫", "𧾷", "𦥑", "镸", "⺸", "𦍋", "夋", "𦉶", "㒳", "㐬", "𠦒", "𦣞", "𦣝", "丣", "戼", "𠃬", "㕯", "㫃", "囧", "𦣻", "囱", "囪", "㡀", "严", "𠦑", "㳄", "我", "巠", "甹", "皀", "夆", "亜", "来"]
        },
        {
          name: "08畫",
          characters: ["金", "長", "門", "阜", "隶", "隹", "雨", "青", "非", "釒", "⻗", "靑", "飠", "叀", "亝", "𣏟", "㣇", "甾", "幷", "𨸏", "𣶒", "罙", "忝", "匋", "奄", "東", "疌", "黾", "靣"]
        },
        {
          name: "09畫",
          characters: ["面", "革", "韋", "韭", "音", "頁", "風", "飛", "食", "首", "香", "𩙿", "叚", "壴", "复", "亲", "枼", "昜", "亯", "𡿺", "𠧪", "県", "𥄉", "㲋", "𢑚", "㢴", "𢏚", "咢", "奐", "禺", "南"]
        },
        {
          name: "10畫",
          characters: ["馬", "骨", "高", "髟", "鬥", "鬯", "鬲", "鬼", "𤇾", "丵", "𠂹", "𣆪", "𩠐", "𡸁", "隺", "尃", "𧴪", "𥁕", "臽", "䍃", "芻", "皋"]
        },
        {
          name: "11畫",
          characters: ["魚", "鳥", "鹵", "鹿", "麥", "麻", "㒼", "𦰩", "𠦬", "𠁁", "桼", "啇", "袞", "翏", "啚", "悤", "粛"]
        },
        {name: "12畫", characters: ["黃", "黍", "黑", "黹", "菐", "巽", "粦", "尌", "朁", "尞", "厤", "肅", "𤔔", "𠥓"]},
        {name: "13畫", characters: ["黽", "鼎", "鼓", "鼠", "𦥯", "𦝠", "𢊁", "廌", "𠌶", "亶", "嗇", "睘"]},
        {name: "14畫", characters: ["鼻", "齊", "𨛜", "㥯", "熏"]},
        {name: "15畫", characters: ["齒", "嘼", "廛", "巤"]},
        {name: "16畫", characters: ["龍", "龜"]},
        {name: "17畫", characters: ["龠", "𩫖", "毚", "韱"]}
      ],
    };
  },
  methods: {
    handleExhaust() {
      let result = '';
      for (let index = 0; index < this.seekerQuery.length; index++) {
        result += exhaust(this.seekerQuery[index], this.checkList.includes('subdivide'), 0);
      }
      this.seekerQuery = result;
    },
    handleSearch() {
      if (this.seekerQuery.trim() === '') {
        this.$message.warning('请输入搜索内容');
        return;
      }
      // 模拟搜索结果
      this.results = Array(5)
          .fill(0)
          .map((_, index) => `结果 ${index + 1}: ${this.seekerQuery}`);
    },
    toggleKeyboard() {
      this.showKeyboard = !this.showKeyboard;
    },
    handleKeyClick(char) {
      this.seekerQuery += char;
    }
  }
}
;
</script>

<style scoped>
.adaptive-page {
  padding: 16px;
  font-family: Arial, sans-serif;
}

.title-row {
  margin-bottom: 20px;
}

.seeker-row .search-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.seeker-options .options-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.seeker-options .options-container {
  gap: 0;
}

.keyboard-row {
  margin-top: 10px;
}

.keyboard-container {
  background-color: #f9f9f9;
  border-radius: 4px;
  text-align: center;
  display: flex;
  flex-wrap: wrap; /* 自动换行 */
  justify-content: center; /* 水平居中 */
  gap: 0; /* 去掉按钮间的间隔 */
  padding: 10px;
  max-height: 300px; /* 限制容器的最大高度 */
  overflow-y: auto; /* 添加竖向滚动条 */
}

.virtual-keyboard .keyboard-row {
  display: flex;
  flex-wrap: wrap; /* 自动换行 */
  justify-content: flex-start; /* 按钮靠左对齐 */
  gap: 0; /* 去掉按钮间距 */
  margin-bottom: 5px; /* 控制按钮行之间的竖向间距 */
}

.virtual-keyboard .keyboard-row el-button {
  margin: 0; /* 去掉按钮外边距 */
  height: 30px; /* 控制按钮的高度 */
  line-height: 30px; /* 保证按钮内文字垂直居中 */
}

.result-card {
  margin: 10px auto;
  max-width: 600px;
  text-align: center;
}
</style>
