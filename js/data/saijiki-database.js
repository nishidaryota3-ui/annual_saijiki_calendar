/**
 * 歳時記・二十四節気・七十二候・季語・俳句 総合データベース
 * (Comprehensive Saijiki, 24 Solar Terms & 72 Micro-Seasons Database)
 */

window.SEASONS = [
    { id: "spring", name: "春", en: "Spring", color: "#5c9272", bg: "rgba(92,146,114,0.15)", startDeg: 315, endDeg: 45, sekkiCount: 6, desc: "万物の芽吹きと生命の躍動" },
    { id: "summer", name: "夏", en: "Summer", color: "#b85d56", bg: "rgba(184,93,86,0.15)", startDeg: 45, endDeg: 135, sekkiCount: 6, desc: "光と風、水と緑の繁茂" },
    { id: "autumn", name: "秋", en: "Autumn", color: "#c28542", bg: "rgba(194,133,66,0.15)", startDeg: 135, endDeg: 225, sekkiCount: 6, desc: "実りと月、静けさの深まり" },
    { id: "winter", name: "冬", en: "Winter", color: "#5b8ea6", bg: "rgba(91,142,166,0.15)", startDeg: 225, endDeg: 315, sekkiCount: 6, desc: "雪と静寂、春を待つ根の息吹" }
];

window.SOLAR_TERMS_24 = [
    // 春 (Spring)
    { id: "risshun", name: "立春", reading: "りっしゅん", solarLong: 315, approxDate: "2/4", season: "春", desc: "春の始まり。寒さ極まり、微かな春の気配が立ち始める。" },
    { id: "usui", name: "雨水", reading: "うすい", solarLong: 330, approxDate: "2/19", season: "春", desc: "雪が雨へと変わり、積もった雪が解け始める。" },
    { id: "keichitsu", name: "啓蟄", reading: "けいちつ", solarLong: 345, approxDate: "3/5", season: "春", desc: "大地が温まり、冬眠していた虫たちが土から這い出る。" },
    { id: "shunbun", name: "春分", reading: "しゅんぶん", solarLong: 0, approxDate: "3/20", season: "春", desc: "太陽が真東から昇り真西に沈む。昼夜の長さがほぼ等しくなる。" },
    { id: "seimei", name: "清明", reading: "せいめい", solarLong: 15, approxDate: "4/4", season: "春", desc: "清浄明潔。万物が清らかで生き生きと輝く季節。" },
    { id: "kokuu", name: "穀雨", reading: "こくう", solarLong: 30, approxDate: "4/20", season: "春", desc: "春雨が百穀を潤し、田畑を豊かに育てる。" },

    // 夏 (Summer)
    { id: "rikka", name: "立夏", reading: "りっか", solarLong: 45, approxDate: "5/5", season: "夏", desc: "夏の始まり。新緑が眩しく、爽やかな初夏の風が渡る。" },
    { id: "shoman", name: "小満", reading: "しょうまん", solarLong: 60, approxDate: "5/21", season: "夏", desc: "草木が茂り、万物が次第に満ち満ちていく。" },
    { id: "boushu", name: "芒種", reading: "ぼうしゅ", solarLong: 75, approxDate: "6/5", season: "夏", desc: "稲や麦など芒（のぎ）のある穀物の種を蒔く頃。" },
    { id: "geshi", name: "夏至", reading: "げし", solarLong: 90, approxDate: "6/21", season: "夏", desc: "一年で最も昼が長く、太陽が最も高く登る日。" },
    { id: "shosho", name: "小暑", reading: "しょうしょ", solarLong: 105, approxDate: "7/7", season: "夏", desc: "梅雨が明け、本格的な夏の暑さが始まる頃。" },
    { id: "taisho", name: "大暑", reading: "たいしょ", solarLong: 120, approxDate: "7/23", season: "夏", desc: "最も暑さが厳しく、夏の盛りを迎える頃。" },

    // 秋 (Autumn)
    { id: "risshu", name: "立秋", reading: "りっしゅう", solarLong: 135, approxDate: "8/7", season: "秋", desc: "秋の始まり。暦の上では秋となり、朝夕に涼風が立ち始める。" },
    { id: "shosho2", name: "処暑", reading: "しょしょ", solarLong: 150, approxDate: "8/23", season: "秋", desc: "暑さが退き、穀物が実り始める頃。" },
    { id: "hakuro", name: "白露", reading: "はくろ", solarLong: 165, approxDate: "9/7", season: "秋", desc: "夜の間に大気が冷え、草花に白露が宿る。" },
    { id: "shubun", name: "秋分", reading: "しゅうぶん", solarLong: 180, approxDate: "9/23", season: "秋", desc: "昼夜が再び等しくなり、秋の夜長へと向かう。" },
    { id: "kanro", name: "寒露", reading: "かんろ", solarLong: 195, approxDate: "10/8", season: "秋", desc: "露が冷たく凍りそうになり、秋が深まる。" },
    { id: "soukou", name: "霜降", reading: "そうこう", solarLong: 210, approxDate: "10/23", season: "秋", desc: "朝晩の冷え込みが増し、初霜が降り始める頃。" },

    // 冬 (Winter)
    { id: "rittou", name: "立冬", reading: "りっとう", solarLong: 225, approxDate: "11/7", season: "冬", desc: "冬の始まり。木枯らしが吹き、冬の気配が立つ。" },
    { id: "shousetsu", name: "小雪", reading: "しょうせつ", solarLong: 240, approxDate: "11/22", season: "冬", desc: "寒さが増し、遠くの山々に雪が舞い始める。" },
    { id: "taisetsu", name: "大雪", reading: "たいせつ", solarLong: 255, approxDate: "12/7", season: "冬", desc: "本格的な降雪の季節となり、平地にも雪が積もる。" },
    { id: "touji", name: "冬至", reading: "とうじ", solarLong: 270, approxDate: "12/21", season: "冬", desc: "一年で最も昼が短く、夜が最も長い日。太陽の復活の日。" },
    { id: "shoukan", name: "小寒", reading: "しょうかん", solarLong: 285, approxDate: "1/5", season: "冬", desc: "寒の入り。寒さが一段と厳しくなる。" },
    { id: "daikan", name: "大寒", reading: "だいかん", solarLong: 300, approxDate: "1/20", season: "冬", desc: "一年で最も寒い極寒の時期。" }
];

window.MICRO_SEASONS_72 = [
    // 立春
    { id: 1, name: "東風解凍", reading: "はるかぜこおりをとく", sekki: "立春", season: "春", kigo: "東風・解氷", haiku: "東風吹かば にほひおこせよ 梅の花（菅原道真）", desc: "春風が吹き、冬の氷を解かし始める頃。" },
    { id: 2, name: "黄鶯睍睆", reading: "うぐいすなく", sekki: "立春", season: "春", kigo: "春告鳥・初音", haiku: "鶯の 笠落したる 椿かな（蕪村）", desc: "山里でウグイスが初音を響かせ始める頃。" },
    { id: 3, name: "魚上氷", reading: "うおこおりをいずる", sekki: "立春", season: "春", kigo: "春の水・薄氷", haiku: "春の水 山なき国を 流れけり（蕪村）", desc: "割れた氷の間から魚が飛び跳ねる頃。" },
    // 雨水
    { id: 4, name: "土脉潤起", reading: "つちのしょううるおいおこる", sekki: "雨水", season: "春", kigo: "春雨・土匂う", haiku: "春雨や 暮れなんとして 今日もけふ（蕪村）", desc: "冷たい雪が雨となり、大地が潤い目覚める頃。" },
    { id: 5, name: "霞始靆", reading: "かすみはじめてたなびく", sekki: "雨水", season: "春", kigo: "春霞・朧月", haiku: "春霞 立つを見捨てて 行く雁は（伊勢）", desc: "春霞が野山にうっすらとたなびき始める頃。" },
    { id: 6, name: "草木萌動", reading: "そうもくめばえいずる", sekki: "雨水", season: "春", kigo: "草萌え・芽吹き", haiku: "草萌えて 命あらはに なりゆけり（虚子）", desc: "草木が緑の小さな芽を吹き始める頃。" },
    // 啓蟄
    { id: 7, name: "蟄虫啓戸", reading: "すごもりむしとをひらく", sekki: "啓蟄", season: "春", kigo: "啓蟄・虫出づ", haiku: "啓蟄や 陽炎燃ゆる 草の上（子規）", desc: "土の中で冬眠していた虫たちが穴を出る頃。" },
    { id: 8, name: "桃始笑", reading: "ももはじめてさく", sekki: "啓蟄", season: "春", kigo: "桃の花・初花", haiku: "桃の花 咲きて心も ほぐれけり（素堂）", desc: "桃の花がつぼみを開き、ほころび咲く頃。" },
    { id: 9, name: "菜虫化蝶", reading: "なむしちょうとなる", sekki: "啓蟄", season: "春", kigo: "初蝶・菜の花", haiku: "菜の花や 月は東に 日は西に（蕪村）", desc: "青虫が羽化してモンシロチョウになる頃。" },
    // 春分
    { id: 10, name: "雀始巣", reading: "すずめはじめてすくう", sekki: "春分", season: "春", kigo: "雀の巣・春うらら", haiku: "雀の子 そこのけそこのけ 御馬が通る（一茶）", desc: "スズメが枯れ草を運んで巣を作り始める頃。" },
    { id: 11, name: "桜始開", reading: "さくらはじめてひらく", sekki: "春分", season: "春", kigo: "初桜・桜前線", haiku: "さまざまの 事おもひ出す 桜かな（芭蕉）", desc: "桜の花が各地で咲き始め、山が桜色に染まる頃。" },
    { id: 12, name: "雷乃発声", reading: "かみなりすなわちこえをはっす", sekki: "春分", season: "春", kigo: "春雷・虫出しの雷", haiku: "春雷や 空の青さに ひびきそめ（素堂）", desc: "春の訪れを告げる春雷が遠くで鳴り響く頃。" },
    // 清明
    { id: 13, name: "玄鳥至", reading: "つばめきたる", sekki: "清明", season: "春", kigo: "燕・つばくろ", haiku: "乙鳥や 軒の雨だれ くぐり飛ぶ（一茶）", desc: "ツバメが南の海を越えて日本へ渡ってくる頃。" },
    { id: 14, name: "鴻雁北", reading: "こうがんかえる", sekki: "清明", season: "春", kigo: "帰る雁・名残の鳥", haiku: "行く春や 鳥啼き魚の 目は泪（芭蕉）", desc: "冬を越した雁（ガン）が北のシベリアへ帰る頃。" },
    { id: 15, name: "虹始見", reading: "にじはじめてあらわる", sekki: "清明", season: "春", kigo: "初虹・雨上がり", haiku: "雨晴れて 虹立つ山や 春の暮（子規）", desc: "大気中の水滴が増え、雨上がりに淡い虹が見える頃。" },
    // 穀雨
    { id: 16, name: "葭始生", reading: "あしはじめてしょうず", sekki: "穀雨", season: "春", kigo: "若葦・角組む", haiku: "水辺なる 葦の若葉に 風わたる（蕪村）", desc: "水辺の葦（アシ）が青々とした若芽を伸ばす頃。" },
    { id: 17, name: "霜止出苗", reading: "しもやみてなえいづる", sekki: "穀雨", season: "春", kigo: "苗代・種籾", haiku: "苗代や 雲雀のあがる 空の青（去来）", desc: "遅霜の心配がなくなり、水田の稲苗がすくすく育つ頃。" },
    { id: 18, name: "牡丹華", reading: "ぼたんはなさく", sekki: "穀雨", season: "春", kigo: "牡丹・百花の王", haiku: "牡丹散りて 打かさなりぬ 二三片（蕪村）", desc: "百花の王である牡丹（ボタン）が大輪の花を咲かせる頃。" },

    // 立夏
    { id: 19, name: "蛙始鳴", reading: "かわずはじめてなく", sekki: "立夏", season: "夏", kigo: "初蛙・若葉風", haiku: "古池や 蛙飛びこむ 水の音（芭蕉）", desc: "田んぼに水が張られ、カエルの鳴き声が響き渡る頃。" },
    { id: 20, name: "蚯蚓出", reading: "みみずいずる", sekki: "立夏", season: "夏", kigo: "土の息吹・若葉", haiku: "みみず鳴く 闇の底なる 音かな（子規）", desc: "ミミズが温まった土の中から顔を出す頃。" },
    { id: 21, name: "竹笋生", reading: "たけのこしょうず", sekki: "立夏", season: "夏", kigo: "筍・竹の秋", haiku: "筍や 親に似たるも 似ざるも（一茶）", desc: "竹林にタケノコが勢いよく顔を出し、若竹へと伸びる頃。" },
    // 小満
    { id: 22, name: "蚕起食桑", reading: "かいこおきてくわをはむ", sekki: "小満", season: "夏", kigo: "蚕・桑摘み", haiku: "蚕飼ふや 雨音静かに 桑の葉に（子規）", desc: "蚕（カイコ）が孵化し、桑の葉を盛んに食べ始める頃。" },
    { id: 23, name: "紅花栄", reading: "べにばなさかう", sekki: "小満", season: "夏", kigo: "紅花・初夏の色", haiku: "繭白し 桑の緑の 眩しきに（虚子）", desc: "紅花（ベニバナ）が一面に咲き、黄金色から紅色へと染まる頃。" },
    { id: 24, name: "麦秋至", reading: "むぎのときいたる", sekki: "小満", season: "夏", kigo: "麦秋・麦の秋", haiku: "麦秋や 井戸端に立つ 人の影（蕪村）", desc: "麦畑が黄金色に熟し、収穫の時期（麦秋）を迎える頃。" },
    // 芒種
    { id: 25, name: "蟷螂生", reading: "かまきりしょうず", sekki: "芒種", season: "夏", kigo: "若蟷螂・青葉", haiku: "蟷螂の 生まるる庭の 静けさよ（子規）", desc: "カマキリの卵から無数の小さな赤ちゃんが生まれる頃。" },
    { id: 26, name: "腐草為蛍", reading: "くされたるくさほたるとなる", sekki: "芒種", season: "夏", kigo: "蛍・蛍火", haiku: "草の葉を 落ちて飛びけり 蛍かな（千代女）", desc: "水辺の草むらからホタルが幻想的な光を放って飛び交う頃。" },
    { id: 27, name: "梅子黄", reading: "うめの実きばむ", sekki: "芒種", season: "夏", kigo: "実梅・入梅", haiku: "梅の実の 青き香りの こぼれけり（虚子）", desc: "梅の実が熟して黄色く色づき、梅雨の気配が迫る頃。" },
    // 夏至
    { id: 28, name: "乃東枯", reading: "なつかれくさかるる", sekki: "夏至", season: "夏", kigo: "夏至・短夜", haiku: "夏至の夜の ほの白き空 静まりぬ（子規）", desc: "冬に芽生えたウツボグサ（夏枯草）が花を枯らす頃。" },
    { id: 29, name: "菖蒲華", reading: "あやめはなさく", sekki: "夏至", season: "夏", kigo: "花菖蒲・水辺", haiku: "菖蒲咲く 水に映れる 空の碧（蕪村）", desc: "水辺に青紫色の花菖蒲（ハナショウブ）が咲き競う頃。" },
    { id: 30, name: "半夏生", reading: "はんげしょうず", sekki: "夏至", season: "夏", kigo: "半夏生・蛸", haiku: "半夏生 水路をめぐる 田の光（一茶）", desc: "烏柄杓（カラスビシャク）が生え、田植えを終える目安の日。" },
    // 小暑
    { id: 31, name: "温風至", reading: "あつかぜいたる", sekki: "小暑", season: "夏", kigo: "熱風・白南風", haiku: "白南風や 帆を張りあげて 海をゆく（蕪村）", desc: "夏の熱い南風（白南風）が吹き始め、梅雨が明ける頃。" },
    { id: 32, name: "蓮始開", reading: "はすはじめてひらく", sekki: "小暑", season: "夏", kigo: "蓮の花・蓮華", haiku: "蓮の花 ひらく音聴く 静寂かな（漱石）", desc: "清らかな水辺でハスの花が朝の光とともに開き始める頃。" },
    { id: 33, name: "鷹乃学習", reading: "たかすなわちわざをならう", sekki: "小暑", season: "夏", kigo: "鷹の巣立ち・夏の山", haiku: "夏の山 鷹の飛翔の 高き空（子規）", desc: "鷹の雛が巣立ち、飛び方や狩りの技を学び始める頃。" },
    // 大暑
    { id: 34, name: "桐始結花", reading: "きりはじめてはなをむすぶ", sekki: "大暑", season: "夏", kigo: "桐の実・夏の盛り", haiku: "炎天に 桐の梢の 実をなせる（蕪村）", desc: "桐（キリ）の木が花を終え、翌年のための実を結ぶ頃。" },
    { id: 35, name: "土潤溽暑", reading: "つちうるおうてむしあつし", sekki: "大暑", season: "夏", kigo: "溽暑・夕立", haiku: "夕立や 草葉をつかむ むら雀（蕪村）", desc: "土が湿り気を含み、蒸し暑さが極まる真夏の頃。" },
    { id: 36, name: "大雨時行", reading: "たいうときどきにふる", sekki: "大暑", season: "夏", kigo: "スコール・入道雲", haiku: "雲の峰 いくつ崩れて 月の山（芭蕉）", desc: "青空に入道雲が湧き上がり、激しい夕立（夕立雲）が降る頃。" },

    // 立秋
    { id: 37, name: "涼風至", reading: "すずかぜいたる", sekki: "立秋", season: "秋", kigo: "初秋・秋風", haiku: "秋来ぬと 目にはさやかに 見えねども 風の音にぞ おどろかれぬる（藤原敏行）", desc: "朝夕の風にふと秋の涼しさが混じり始める頃。" },
    { id: 38, name: "寒蝉鳴", reading: "ひぐらしなく", sekki: "立秋", season: "秋", kigo: "蜩・日暮し", haiku: "蜩の 鳴くや夕日の 谷深き（芭蕉）", desc: "夕暮れ時にヒグラシがカナカナと澄んだ声で鳴く頃。" },
    { id: 39, name: "蒙霧升降", reading: "ふかききりまとう", sekki: "立秋", season: "秋", kigo: "朝霧・秋霧", haiku: "朝霧や 馬の鼻先 煙たつ（蕪村）", desc: "朝夕の冷え込みにより、森や水辺に深い霧が立ち込める頃。" },
    // 処暑
    { id: 40, name: "綿柎開", reading: "わたのはなしべひらく", sekki: "処暑", season: "秋", kigo: "綿の花・初秋の実", haiku: "綿の花 静かに開く 畑かな（子規）", desc: "綿（ワタ）の萼（がく）が開き、白いコットンボールが覗く頃。" },
    { id: 41, name: "天地始粛", reading: "てんちはじめてしじまじす", sekki: "処暑", season: "秋", kigo: "秋澄む・処暑", haiku: "秋澄むや 梢に宿る 鳥の声（蕪村）", desc: "猛暑が収まり、万物が鎮まり静けさを取り戻す頃。" },
    { id: 42, name: "禾乃登", reading: "こくものすなわちみのる", sekki: "処暑", season: "秋", kigo: "稲穂・実りの秋", haiku: "稲穂波 黄金色なす 夕日かな（子規）", desc: "田んぼの稲が頭を垂れ、黄金色に実り始める頃。" },
    // 白露
    { id: 43, name: "草露白", reading: "くさのつゆしろし", sekki: "白露", season: "秋", kigo: "白露・朝露", haiku: "白露や 無数の玉を 草に置き（子規）", desc: "夜の冷気で、朝の草葉に真珠のような白露が宿る頃。" },
    { id: 44, name: "鶺鴒鳴", reading: "せきれいなく", sekki: "白露", season: "秋", kigo: "セキレイ・水辺の鳥", haiku: "セキレイの 尾を振り歩く 瀬踏みかな（虚子）", desc: "セキレイが水辺でチチッと澄んだ声を響かせ鳴く頃。" },
    { id: 45, name: "玄鳥去", reading: "つばめさる", sekki: "白露", season: "秋", kigo: "去る燕・秋の空", haiku: "燕去りて 空の広さを 知る日かな（子規）", desc: "春に訪れたツバメが、南の越冬地へと旅立つ頃。" },
    // 秋分
    { id: 46, name: "雷乃収声", reading: "かみなりすなわちこえをおさむ", sekki: "秋分", season: "秋", kigo: "名残の雷・澄む空", haiku: "秋高し 心の雲も 晴れゆきて（子規）", desc: "夏の雷鳴が止み、高く澄み渡った秋空が広がる頃。" },
    { id: 47, name: "蟄虫坏戸", reading: "むしかくれてとをふさぐ", sekki: "秋分", season: "秋", kigo: "虫隠る・秋の暮", haiku: "虫隠る 土の温もり 惜しみつつ（子規）", desc: "虫たちが冬眠の準備のため土に潜り穴を閉じる頃。" },
    { id: 48, name: "水始涸", reading: "みずはじめてかる", sekki: "秋分", season: "秋", kigo: "落水・刈田", haiku: "刈田見つ 水音遠く なりにけり（蕪村）", desc: "稲刈りに備えて田んぼの水を抜き、刈田が広がる頃。" },
    // 寒露
    { id: 49, name: "鴻雁来", reading: "こうがんきたる", sekki: "寒露", season: "秋", kigo: "初雁・雁渡る", haiku: "初雁や 一列になりて 空を行く（芭蕉）", desc: "北のシベリアから雁（ガン）の群れが越冬のため渡ってくる頃。" },
    { id: 50, name: "菊花開", reading: "きくのはなひらく", sekki: "寒露", season: "秋", kigo: "菊の花・重陽", haiku: "菊の香や 奈良には古き 仏たち（芭蕉）", desc: "気品ある菊の花が咲き、野山や庭を香りで満たす頃。" },
    { id: 51, name: "蟋蟀在戸", reading: "きりぎりすとにあり", sekki: "寒露", season: "秋", kigo: "秋の虫・蟋蟀", haiku: "こほろぎや 畳の隅に 鳴きにけり（子規）", desc: "キリギリスやコオロギが戸口に寄り添い鳴き交わす頃。" },
    // 霜降
    { id: 52, name: "霜始降", reading: "しもはじめてふる", sekki: "霜降", season: "秋", kigo: "初霜・霜夜", haiku: "霜降るや 庭の小草の 白くなり（子規）", desc: "大地に初霜が降り、朝の草木が銀色に輝く頃。" },
    { id: 53, name: "霎時施", reading: "こさめときどきふる", sekki: "霜降", season: "秋", kigo: "時雨・初冬の雨", haiku: "旅人と 我名よばれん 初時雨（芭蕉）", desc: "サーッと降っては晴れる初冬の時雨（しぐれ）が降る頃。" },
    { id: 54, name: "楓蔦黄", reading: "もみじつたきばむ", sekki: "霜降", season: "秋", kigo: "紅葉・錦秋", haiku: "秋深き 隣は何を する人ぞ（芭蕉）", desc: "モミジやツタが鮮やかな赤や黄色に染まり、錦秋を迎える頃。" },

    // 立冬
    { id: 55, name: "山茶始開", reading: "つばきはじめてひらく", sekki: "立冬", season: "冬", kigo: "山茶花・初冬の花", haiku: "山茶花や 散り敷く道の 紅き色（子規）", desc: "サザンカが初冬の冷たい風の中で紅色や白色の花を咲かせる頃。" },
    { id: 56, name: "地始凍", reading: "ちはじめてこおる", sekki: "立冬", season: "冬", kigo: "初氷・凍土", haiku: "大地凍て 星の輝き 増す夜かな（子規）", desc: "夜の冷え込みで地中の水分が凍り、霜柱が立ち始める頃。" },
    { id: 57, name: "金盞香", reading: "きんせんかさく", sekki: "立冬", season: "冬", kigo: "水仙・冬の花", haiku: "水仙や 白き障子の とも滝（芭蕉）", desc: "寒さの中で水仙（金盞花）が可憐な花を咲かせ香る頃。" },
    // 小雪
    { id: 58, name: "虹蔵不見", reading: "にじかくれてみえず", sekki: "小雪", season: "冬", kigo: "冬の空・木枯らし", haiku: "木枯らしや 海に夕日を 吹き落とす（蕪村）", desc: "太陽光が弱まり、空に虹が見られなくなる頃。" },
    { id: 59, name: "朔風払葉", reading: "きたかぜこのはをはらう", sekki: "小雪", season: "冬", kigo: "落葉・木枯らし", haiku: "落ち葉掃く 音の静けさ 暮れてゆく（子規）", desc: "冷たい北風（朔風）が吹き、木々の枯れ葉を散らす頃。" },
    { id: 60, name: "橘始黄", reading: "たちばなはじめてきばむ", sekki: "小雪", season: "冬", kigo: "橘の実・冬青", haiku: "橘の 実の黄なる見つ 冬の庭（子規）", desc: "柑橘類（タチバナやミカン）の実が黄金色に色づく頃。" },
    // 大雪
    { id: 61, name: "閉塞成冬", reading: "そらふさがりてふゆとなる", sekki: "大雪", season: "冬", kigo: "冬空・雪催い", haiku: "雪催う 空の重さや 暮れかかる（子規）", desc: "灰色の雪雲が空を覆い、真冬の重厚な空気が包む頃。" },
    { id: 62, name: "熊蟄穴", reading: "くまあなにこもる", sekki: "大雪", season: "冬", kigo: "冬眠・穴籠もり", haiku: "穴籠もる 獣の夢の 深き雪（子規）", desc: "クマが木の洞や岩穴に入り、春まで冬眠に入る頃。" },
    { id: 63, name: "鱖魚群", reading: "さけのうおむらがる", sekki: "大雪", season: "冬", kigo: "鮭・鮭上る", haiku: "鮭上る 川の瀬音の 激しきに（虚子）", desc: "産卵のためサケの群れが生まれた川を勢いよく遡上する頃。" },
    // 冬至
    { id: 64, name: "乃東生", reading: "なつかれくさしょうず", sekki: "冬至", season: "冬", kigo: "一陽来復・柚子湯", haiku: "柚子湯吹く 湯気にあたたむ 命かな（子規）", desc: "真冬の中でウツボグサ（夏枯草）が青い芽を出す頃。" },
    { id: 65, name: "麋角解", reading: "さわしかのつのおつる", sekki: "冬至", season: "冬", kigo: "鹿の角落ち・冬至", haiku: "冬至なる 日の短さよ 影のびて（子規）", desc: "雄シカの角がぽろりと抜け落ち、新しい角が生え始める頃。" },
    { id: 66, name: "雪下出麦", reading: "ゆきわたりてむぎのびる", sekki: "冬至", season: "冬", kigo: "雪中の麦・春の兆し", haiku: "雪の下 麦の緑の 萌ゆる見ゆ（蕪村）", desc: "積もる雪の下で、麦が静かに力強く芽を伸ばす頃。" },
    // 小寒
    { id: 67, name: "芹乃栄", reading: "せりすなわちさかう", sekki: "小寒", season: "冬", kigo: "七草・若菜", haiku: "芹摘むや 手の冷たさも 忘れつつ（蕪村）", desc: "春の七草の一つであるセリ（芹）が水辺でみずみずしく育つ頃。" },
    { id: 68, name: "水泉動", reading: "しみずあたたかをふくむ", sekki: "小寒", season: "冬", kigo: "春の気配・湧水", haiku: "泉湧く 地下のぬくもり 感じつつ（子規）", desc: "地中深くで凍った泉が解け始め、水がかすかに動き始める頃。" },
    { id: 69, name: "雉始雊", reading: "きじはじめてなく", sekki: "小寒", season: "冬", kigo: "雉鳴く・初声", haiku: "雉子啼くや 野中の一本 立つ松に（蕪村）", desc: "オスのキジが甲高いケーンという声で鳴き始める頃。" },
    // 大寒
    { id: 70, name: "款冬華", reading: "ふきのとうはなさく", sekki: "大寒", season: "冬", kigo: "蕗の薹・早春の息吹", haiku: "蕗の薹 雪を割ってや 顔を出せ（一茶）", desc: "雪解けの地面からフキノトウが黄色い花芽を覗かせる頃。" },
    { id: 71, name: "水沢腹堅", reading: "さわみずこおりつめる", sekki: "大寒", season: "冬", kigo: "厳寒・氷張る", haiku: "沢の氷 鏡の如く 澄み透り（子規）", desc: "沢を流れる水さえも厚く凍りつく極寒の季節。" },
    { id: 72, name: "鶏始乳", reading: "にわとりはじめてとやにつく", sekki: "大寒", season: "冬", kigo: "春待つ・卵", haiku: "春立つと 聞けば心も 動きけり（子規）", desc: "春の気配を感じたニワトリが卵を産み始め、新たな春（立春）へと巡る。" }
];

window.ZODIAC_SIGNS_12 = [
    { id: "aries", symbol: "♈︎", jp: "牡羊座", name: "Aries", startDeg: 0, endDeg: 30, approxDate: "3/21〜4/19" },
    { id: "taurus", symbol: "♉︎", jp: "牡牛座", name: "Taurus", startDeg: 30, endDeg: 60, approxDate: "4/20〜5/20" },
    { id: "gemini", symbol: "♊︎", jp: "双子座", name: "Gemini", startDeg: 60, endDeg: 90, approxDate: "5/21〜6/21" },
    { id: "cancer", symbol: "♋︎", jp: "蟹座", name: "Cancer", startDeg: 90, endDeg: 120, approxDate: "6/22〜7/22" },
    { id: "leo", symbol: "♌︎", jp: "獅子座", name: "Leo", startDeg: 120, endDeg: 150, approxDate: "7/23〜8/22" },
    { id: "virgo", symbol: "♍︎", jp: "乙女座", name: "Virgo", startDeg: 150, endDeg: 180, approxDate: "8/23〜9/22" },
    { id: "libra", symbol: "♎︎", jp: "天秤座", name: "Libra", startDeg: 180, endDeg: 210, approxDate: "9/23〜10/23" },
    { id: "scorpio", symbol: "♏︎", jp: "蠍座", name: "Scorpio", startDeg: 210, endDeg: 240, approxDate: "10/24〜11/22" },
    { id: "sagittarius", symbol: "♐︎", jp: "射手座", name: "Sagittarius", startDeg: 240, endDeg: 270, approxDate: "11/23〜12/21" },
    { id: "capricorn", symbol: "♑︎", jp: "山羊座", name: "Capricorn", startDeg: 270, endDeg: 300, approxDate: "12/22〜1/19" },
    { id: "aquarius", symbol: "♒︎", jp: "水瓶座", name: "Aquarius", startDeg: 300, endDeg: 330, approxDate: "1/20〜2/18" },
    { id: "pisces", symbol: "♓︎", jp: "魚座", name: "Pisces", startDeg: 330, endDeg: 360, approxDate: "2/19〜3/20" }
];
