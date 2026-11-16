// Nội dung bổ sung, được trộn vào content.vi.mjs lúc dựng (xem build.mjs).
export default {
  nav: { home: 'Đạo An', lessons: 'Bài giảng', practice: 'Thiền An', self: 'Hiểu mình', life: 'Đời sống', circle: 'Vòng An', wp: 'Sách trắng', faq: 'Hỏi đáp', road: 'Lộ trình' },
  footer: { line: 'Đạo An (Peaceful Way). Nguồn: Mr.33.' },
  common: { credit: 'Nguồn: Đạo An, Mr.33.', offline: 'Trang này dùng được cả khi không có mạng.' },

  home: {
    hero: { cta1: 'Đọc bài giảng đầu tiên', cta2: 'Soi gương “Tôi” và “Muốn”' },
    one: {
      flow: ['Tôi muốn hạnh phúc', 'Bỏ Tôi · Bỏ Muốn', 'An', 'Thấu hiểu bản thân', 'Hạnh phúc chân thật', 'Ý nghĩa cuộc sống'],
      support: 'Thiền An · phương pháp bổ trợ để tìm bình an trong nội tâm',
      via: 'hiểu Vòng tròn Hiếu Đạo',
    },
    learn: { h: 'Mười hai bài giảng', intro: 'Đi từ câu “Tôi muốn hạnh phúc” đến Vòng tròn Hiếu Đạo. Mỗi bài vài phút, có một việc để làm và một câu để tự hỏi.', cta: 'Xem tất cả bài giảng' },
    practices: { intro: 'Biết Đủ là cốt lõi. Cân Bằng giữ nhịp cho đời sống. Thiền An là phương pháp bổ trợ cho hành trình tìm bình an trong nội tâm.' },
    faqMore: 'Xem tất cả câu hỏi và thuật ngữ',
  },

  practice: { role: 'Thiền An không phải trung tâm của Đạo An. Mọi thứ bắt đầu từ câu “Tôi muốn hạnh phúc”; Thiền An là phương pháp bổ trợ cho hành trình tìm kiếm bình an trong nội tâm.', path: ['Lúc nào cũng được', 'Tư thế nào cũng được', 'Chọn một cách', 'Tâm đi thì đưa về', 'Chỉ lắng nghe'] },
  self: { first: { h: 'Khi tâm chưa yên', text: 'Thiền An là phương pháp bổ trợ: vài phút tĩnh lặng giúp bạn nhìn mình rõ hơn.', cta: 'Tới Thiền An' } },

  lessons: {
    title: 'Bài giảng Đạo An — Mười hai bài từ “Tôi muốn hạnh phúc” đến Vòng tròn Hiếu Đạo',
    desc: 'Mười hai bài giảng ngắn về Đạo An: Tôi muốn hạnh phúc, cái tôi, lòng tham, Biết Đủ, An, Hiếu, Đạo, Đức, Phúc, Tài, thấu hiểu bản thân và Thiền An.',
    h: 'Bài giảng',
    lead: 'Mười hai bài ngắn. Mỗi bài có một lời gốc, một lời giảng, một việc để làm và một câu để tự hỏi.',
    groups: [['Câu hỏi khởi đầu', 'Tôi muốn hạnh phúc', 0, 4], ['Vòng tròn Hiếu Đạo', 'An là trung tâm', 4, 10], ['Đích đến và phương pháp', 'Hiểu mình, và tĩnh lặng', 10, 12]],
    of: 'Bài', prev: 'Bài trước', next: 'Bài tiếp', all: 'Tất cả bài giảng', credit: 'Soạn theo Đạo An của Mr.33.',
  },

  life: {
    title: 'Đạo An trong đời sống — Khi giận, khi ganh tị, khi mất mát, khi kiệt sức',
    desc: 'Mười tình huống thường gặp và cách Đạo An nhìn chúng: giọng nào đang nói, “Tôi” hay “Muốn”, nên làm gì ngay và tự hỏi điều gì.',
    h: 'Đạo An trong đời sống',
    lead: 'Mười lúc khó thường gặp. Với mỗi lúc: giọng nào đang nói, nhìn nó thế nào, làm gì ngay, và một câu để tự hỏi.',
    labels: { voice: 'Giọng đang nói', see: 'Nhìn', act: 'Làm ngay', ask: 'Tự hỏi' },
    voices: { toi: 'Tôi', muon: 'Muốn', both: 'Tôi và Muốn', none: 'Không phải lỗi của bạn' },
    items: [
      { icon: 'toi', voice: 'toi', name: 'Khi giận', see: 'Cơn giận thường là cái tôi bị chạm: “tôi bị coi thường”, “tôi phải đúng”.', act: 'Dừng lại. Đếm thầm một vòng từ 1 đến 6 trước khi nói.', ask: 'Tôi đang bảo vệ điều đúng, hay bảo vệ hình ảnh của mình?' },
      { icon: 'muon', voice: 'both', name: 'Khi ganh tị, so sánh', see: '“Muốn” nhìn vào thứ người khác có; “Tôi” đem mình ra đo.', act: 'Viết ba điều đủ của hôm nay. Tắt nguồn gây so sánh trong một ngày.', ask: 'Thứ họ có, nó có phù hợp với tôi không?' },
      { icon: 'du', voice: 'muon', name: 'Khi lo về tiền', see: 'Có nỗi lo thật cần hành động thật. Có nỗi lo là “chưa đủ” không bao giờ dừng.', act: 'Viết ra con số đủ của bạn. Việc nào trong tầm tay thì làm hôm nay.', ask: 'Tôi thiếu thật, hay tôi sợ thiếu?' },
      { icon: 'hieu', voice: 'toi', name: 'Khi mâu thuẫn với cha mẹ', see: 'Thường là hai cái tôi gặp nhau. Hiếu là làm cha mẹ yên lòng, không phải thắng cha mẹ.', act: 'Nghe hết một lần mà không cãi. Nói điều bạn biết ơn trước khi nói điều bạn không đồng ý.', ask: 'Cha mẹ đang lo điều gì cho tôi?' },
      { icon: 'still', voice: 'muon', name: 'Khi kiệt sức', see: 'Khi hoạt động quá nhiều, năng lượng không còn để chữa lành bên trong.', act: 'Thôi hoạt động. Năm phút không làm gì, chỉ lắng nghe cơ thể.', ask: 'Tôi đang làm thêm vì cần, hay vì “chưa đủ”?' },
      { icon: 'toi', voice: 'toi', name: 'Khi thất bại', see: 'Việc hỏng là một sự kiện. “Tôi là kẻ thất bại” là cái tôi đang kể chuyện.', act: 'Viết ra một điều đã học được và một việc sẽ sửa.', ask: 'Tôi đau vì việc hỏng, hay vì người khác nhìn thấy?' },
      { icon: 'an', voice: 'none', name: 'Khi mất mát', see: 'Nỗi buồn khi mất người thân không phải là Tham hay Cái Tôi. Nó là tình thương.', act: 'Cho phép mình buồn. Ngồi yên và lắng nghe. Tìm một người để ở bên. Nếu kéo dài, hãy gặp chuyên gia.', ask: 'Người ấy đã để lại gì trong tôi?' },
      { icon: 'phuc', voice: 'toi', name: 'Khi cô đơn', see: 'Ý nghĩa cuộc sống được tìm thấy qua hành động và quan hệ với người khác.', act: 'Làm một việc tử tế cho một người, hôm nay. Gọi một cuộc điện thoại.', ask: 'Ai đang cần tôi mà tôi chưa nhìn thấy?' },
      { icon: 'self', voice: 'both', name: 'Khi không biết mình muốn gì', see: 'Khi ta An, ta thấu hiểu bản thân. Tâm chưa yên thì chưa thấy rõ.', act: 'Vài phút tĩnh lặng, rồi làm công cụ “Điều tôi thật sự muốn”.', ask: 'Điều này là tôi muốn, hay người khác muốn cho tôi?' },
      { icon: 'tai', voice: 'toi', name: 'Khi thành công, được khen', see: 'Đây là lúc cái tôi dễ phình to nhất.', act: 'Cảm ơn cụ thể những người đã giúp. Chia sẻ một phần bạn có.', ask: 'Thành công này làm tôi nhẹ hơn hay nặng hơn?' },
    ],
    caution: 'Nếu bạn đang trong khủng hoảng, hoặc có ý nghĩ làm hại bản thân, hãy gọi ngay cho người thân, bác sĩ hoặc đường dây hỗ trợ tại nơi bạn sống. Đạo An là sự hỗ trợ, không thay thế chăm sóc chuyên môn.',
  },

  circle: {
    title: 'Vòng An — Nhịp thực hành hằng ngày và cách cùng nhau thực hành Đạo An',
    desc: 'Nhịp một ngày theo Đạo An, Lời An sáng và tối, cách mở một Vòng An 5–12 người gặp nhau hằng tuần, và chín cam kết của người thực hành.',
    h: 'Vòng An',
    lead: 'Nhịp thực hành của một ngày, một tuần, và cách cùng nhau thực hành trong một nhóm nhỏ. Không cần người dẫn dắt, không cần đóng góp.',
    day: {
      h: 'Nhịp một ngày',
      parts: [['Sáng', 'Đọc Lời An buổi sáng. Vài phút tĩnh lặng trước khi mở điện thoại.'], ['Trong ngày', 'Làm việc gì, trọn vẹn với việc đó. Khi căng: đếm 1 đến 6, hỏi “Tôi hay Muốn?”.'], ['Chiều', 'Một việc Hiếu hoặc một việc tử tế: một cuộc gọi, một lời cảm ơn.'], ['Tối', 'Viết ba điều đủ. Đọc Lời An buổi tối.']],
    },
    words: {
      h: 'Lời An',
      intro: 'Hai lời ngắn để mở đầu và khép lại một ngày. Đọc thầm hoặc đọc thành tiếng.',
      morning: ['Buổi sáng', ['Hôm nay tôi bắt đầu từ An.', 'Tôi đặt xuống chữ “Tôi”: không cần phải hơn, không cần phải đúng.', 'Tôi đặt xuống chữ “Muốn”: không đuổi theo điều không phù hợp.', 'Điều còn lại là hạnh phúc, ngay bây giờ.']],
      evening: ['Buổi tối', ['Hôm nay tôi đã có đủ.', 'Tôi biết ơn những người đã cho tôi ngày hôm nay.', 'Điều tôi làm chưa đúng, ngày mai tôi sửa.', 'Tôi trở về An.']],
    },
    week: {
      h: 'Mở một Vòng An',
      intro: 'Vòng An là nhóm 5 đến 12 người gặp nhau mỗi tuần một giờ, trực tiếp hoặc trực tuyến. Ai cũng có thể mở: gia đình, bạn bè, đồng nghiệp.',
      min: 'phút',
      agenda: [[5, 'Tĩnh lặng', 'Cùng ngồi yên, đếm thầm 1 đến 6.'], [15, 'Đọc', 'Một người đọc to một bài giảng. Theo thứ tự từ bài 1.'], [25, 'Chia sẻ', 'Mỗi người: một lần “Tôi” hoặc “Muốn” lên tiếng trong tuần, và ba điều đủ.'], [10, 'Hẹn', 'Mỗi người chọn một việc Hiếu hoặc một việc tử tế cho tuần tới.'], [5, 'Lời An', 'Cùng đọc Lời An buổi tối.']],
      rulesH: 'Năm quy ước',
      rules: ['Lắng nghe, không khuyên, không phán xét.', 'Chuyện trong vòng ở lại trong vòng.', 'Ai cũng có thể im lặng. Ai cũng có thể rời đi.', 'Không thu tiền, không bán gì.', 'Không ai là thầy. Người giữ giờ luân phiên mỗi tuần.'],
      print: 'In trang này',
    },
    marks: {
      h: 'Những mốc của đời người',
      intro: 'Một hình thức giản dị dùng cho mọi dịp: một phút tĩnh lặng, một lời biết ơn, một lời hẹn.',
      items: [['Chào đời', 'Cha mẹ nói lời biết ơn ông bà, và hẹn sống sao cho con được yên lòng.'], ['Trưởng thành', 'Người trẻ viết ba nguyên tắc sống của mình và đọc cho gia đình nghe.'], ['Thành đôi', 'Hai người nói với nhau điều mình sẽ buông: phần “Tôi” và phần “Muốn” của mỗi người.'], ['Tiễn biệt', 'Mỗi người kể một điều người đã khuất để lại trong mình.']],
    },
    commit: {
      h: 'Chín cam kết',
      intro: 'Mọi hoạt động nhân danh Đạo An giữ chín điều này.',
      items: ['Tự nguyện', 'Không độc quyền chân lý', 'Không sùng bái cá nhân', 'Minh bạch tài chính', 'Không bán nỗi sợ', 'Không thay thế y khoa', 'Bảo vệ người yếu thế', 'Tôn trọng pháp luật', 'Mở cho phản biện'],
    },
  },

  faq: {
    title: 'Hỏi đáp và thuật ngữ Đạo An',
    desc: 'Những câu hỏi thường gặp về Đạo An (Peaceful Way) và bảng thuật ngữ Việt – Anh: An, Tôi, Muốn, Biết Đủ, Hiếu, Đạo, Đức, Phúc, Tài, Thiền An.',
    h: 'Hỏi đáp và thuật ngữ',
    lead: 'Những điều người mới thường hỏi, và nghĩa của từng chữ.',
    groups: [
      { h: 'Về Đạo An', items: [
        ['Đạo An là gì?', 'Đạo An (Peaceful Way) là một hệ thống tư tưởng, triết lý sống với mục đích giúp con người nhận ra hạnh phúc thực sự của bản thân và sống một cuộc đời đầy ý nghĩa.'],
        ['Ai là tác giả?', 'Mr.33, một người Việt Nam, trong hệ sinh thái Kabala. Bài Thiền An viết tại Hà Nội ngày 1/11/2024; bài Đạo An viết tại Việt Trì ngày 10/04/2025.'],
        ['Đạo An có phải là một tôn giáo không?', 'Đạo An là một triết lý sống thực hành. Nó không đòi hỏi bạn từ bỏ niềm tin nào và không thờ phụng ai.'],
        ['Tôi theo một tôn giáo khác, có thực hành được không?', 'Được. Bạn giữ nguyên tôn giáo của mình. Khi thiền, bạn có thể dùng lời của truyền thống mình.'],
        ['Đạo An có liên quan đến Đại sư Đạo An của Phật giáo không?', 'Không. Đây là một khái niệm hiện đại; sự trùng tên là ngẫu nhiên.'],
      ] },
      { h: 'Về “Tôi muốn hạnh phúc”', items: [
        ['Vì sao bắt đầu từ câu này?', 'Vì đó là điều ai cũng muốn, và câu ấy đã chứa sẵn lời giải: bỏ “Tôi”, bỏ “Muốn”, chỉ còn Hạnh Phúc.'],
        ['Bỏ “Muốn” thì tôi còn động lực sống không?', 'Còn. Điều được buông là lòng tham và mong cầu những điều không phù hợp. Khi hiểu mình, bạn biết rõ hơn điều mình thật sự muốn.'],
        ['Bỏ “Tôi” có phải là xóa bỏ bản thân?', 'Không. Điều được buông là cái tôi phình to: ích kỷ, tự cao, thiếu đồng cảm.'],
        ['Làm sao biết một mong muốn là “không phù hợp”?', 'Hỏi ba câu: nó có đúng với nhu cầu thật của tôi không? Có vượt quá giới hạn của tôi không? Có rồi thì tôi có dừng lại không?'],
        ['“Ngay bây giờ” nghĩa là gì khi đời tôi đang khó?', 'Đạo An không phủ nhận khó khăn thật; việc cần làm thì vẫn phải làm. “Ngay bây giờ” nghĩa là bạn không phải đợi mọi thứ xong xuôi mới được phép thấy yên.'],
      ] },
      { h: 'Về thực hành', items: [
        ['Tôi nên bắt đầu từ đâu?', 'Đọc bài giảng “Tôi muốn hạnh phúc”, rồi làm công cụ soi gương “Tôi” và “Muốn”. Tối nay viết ba điều đủ.'],
        ['Thiền An có bắt buộc không?', 'Không. Thiền An là phương pháp bổ trợ cho hành trình tìm bình an trong nội tâm. Bạn có thể tập bất cứ lúc nào, ở mọi tư thế.'],
        ['Mỗi ngày cần bao nhiêu thời gian?', 'Khoảng mười phút: vài phút tĩnh lặng và ba dòng Biết Đủ. Phần còn lại là cách bạn sống trong ngày.'],
        ['Biết Đủ có phải là an phận?', 'Không. Người biết đủ vẫn làm hết sức; họ chỉ không cần kết quả mới được phép thấy yên.'],
        ['Gia đình tôi phức tạp. Hiếu áp dụng thế nào?', 'Hiếu là nội tâm thanh thản chứ không phải sự ép buộc, và không buộc ai chịu đựng sự tổn hại. Bạn có thể thực hành Hiếu với những người đã có công với mình.'],
        ['Tôi có cần tham gia nhóm không?', 'Không cần. Nhưng thực hành cùng người khác thường bền hơn; xem trang Vòng An.'],
      ] },
      { h: 'Về trang này', items: [
        ['Trang có thu phí hay thu dữ liệu không?', 'Không. Mọi nội dung miễn phí. Ghi chép của bạn chỉ nằm trong trình duyệt của bạn; trang không có tài khoản.'],
        ['Tôi dùng được khi không có mạng không?', 'Được. Sau lần mở đầu tiên, trang tự lưu để dùng ngoại tuyến, và có thể cài như một ứng dụng.'],
        ['Đạo An có thay cho bác sĩ không?', 'Không. Nếu bạn có vấn đề sức khỏe thể chất hay tâm thần, hãy tìm đến chuyên gia.'],
      ] },
    ],
    glossH: 'Thuật ngữ',
    glossHead: ['Tiếng Việt', 'English', 'Nghĩa'],
    gloss: [
      ['Đạo An', 'Peaceful Way', 'Con đường tìm bình an trong nội tâm'],
      ['An', 'Peace (An)', 'Trạng thái nội tâm bình an, tĩnh tại; gốc và trung tâm'],
      ['Tôi · Cái Tôi', 'I · Ego', 'Bản ngã; khi phình to sinh ích kỷ, tự cao, thiếu đồng cảm'],
      ['Muốn · Lòng Tham', 'Want · Greed', 'Ham muốn quá mức và mong cầu những điều không phù hợp'],
      ['Biết Đủ', 'Contentment', 'Biết ơn và hài lòng với những gì đã có; cốt lõi của Đạo An'],
      ['Vòng tròn Hiếu Đạo', 'Circle of Hiếu Đạo', 'An → Hiếu → Đạo → Đức → Phúc → Tài → An'],
      ['Hiếu', 'Filial devotion', 'Yêu thương cha mẹ; sống sao cho cha mẹ yên lòng'],
      ['Đạo', 'The Way', 'Con đường đạo đức và lý tưởng, do bình an dẫn dắt'],
      ['Đức', 'Virtue', 'Tâm hồn cân bằng, tử tế và chân thành'],
      ['Phúc', 'Blessing', 'An nhiên, viên mãn, hòa hợp trong mọi mối quan hệ'],
      ['Tài', 'Abundance', 'Giàu có nhờ biết đủ: trí tuệ, cảm xúc, khả năng chia sẻ'],
      ['Thấu hiểu bản thân', 'Knowing yourself', 'Nhận thức về nhu cầu, mong muốn, hạn chế của mình; đích đến duy nhất'],
      ['Thiền An', 'Peaceful Meditation', 'Phương pháp bổ trợ: thiền định để trở về tĩnh lặng'],
      ['Cân Bằng', 'Balance', 'Giữ cân bằng từ công việc đến đời sống cá nhân'],
      ['Vòng An', 'Circle of An', 'Nhóm nhỏ cùng thực hành hằng tuần'],
    ],
  },

  road: {
    today: { items: [['Đọc “Tôi muốn hạnh phúc”', 'Bài giảng đầu tiên, khoảng ba phút.', 'lesson1', ''], ['Soi gương “Tôi” và “Muốn”', 'Mười hai câu, khoảng ba phút.', 'self', '#mirror'], ['Ba điều đủ tối nay', 'Viết vào sổ Biết Đủ trước khi ngủ.', 'self', '#journal']] },
    plan: {
      intro: 'Một đề xuất thực hành, khoảng 10 phút mỗi ngày. Mỗi ngày thêm vài phút Thiền An nếu tâm bạn cần yên.',
      weeks: [
        ['Tuần 1 · Tôi muốn hạnh phúc', 'Đọc bốn bài giảng đầu. Soi gương “Tôi” và “Muốn”. Mỗi tối viết ba điều đủ.'],
        ['Tuần 2 · Vòng tròn Hiếu Đạo', 'Mỗi ngày một bài, từ An đến Tài, và làm việc thực hành của bài đó. Làm công cụ “Vòng tròn của tôi”.'],
        ['Tuần 3 · Hiểu mình', 'Làm “Điều tôi thật sự muốn” và “Điều tôi buông”. Mỗi ngày một việc Hiếu hoặc một việc tử tế. Rủ một người cùng mở Vòng An.'],
      ],
    },
    site: {
      intro: 'Kế hoạch để bất cứ ai trên thế giới cũng có thể tiếp cận, hiểu và ứng dụng Đạo An.',
      phases: [
        [0, 'Nền tảng', 'Lời gốc của Mr.33, Vòng tròn Hiếu Đạo, Thiền An và Sách trắng, bằng tiếng Việt và tiếng Anh.'],
        [0, 'Bài giảng và đời sống', 'Mười hai bài giảng, mười tình huống đời sống, hỏi đáp và thuật ngữ.'],
        [0, 'Công cụ thấu hiểu bản thân', 'Soi gương “Tôi” và “Muốn”, điều tôi muốn, điều tôi buông, vòng tròn của tôi, sổ Biết Đủ, Cân Bằng.'],
        [0, 'Vòng An', 'Nhịp ngày, Lời An, và hướng dẫn mở nhóm thực hành hằng tuần.'],
        [0, 'Bền vững', 'Không phụ thuộc dịch vụ bên ngoài, dùng được khi không có mạng, cài được như ứng dụng, dữ liệu ở lại trên thiết bị.'],
        [1, 'Thêm ngôn ngữ', 'Trung, Tây Ban Nha, Hindi, Pháp, Nhật, Ả Rập… Mỗi ngôn ngữ là một tệp nội dung.'],
        [1, 'Âm thanh và hình ảnh', 'Bản đọc các bài giảng, hướng dẫn Thiền An bằng giọng nói, podcast và hình minh họa gốc.'],
        [2, 'Kho câu chuyện', 'Lời kể của người thực hành và của các Vòng An trên thế giới.'],
      ],
    },
  },
  wp: { meta: 'Ấn bản 1.2 · Nguồn: Mr.33 · Tháng 11, 2026' },
};
