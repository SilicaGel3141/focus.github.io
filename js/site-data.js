/**
 * ふぉーかす！ - Shared Site Data
 * サイト全体の共通コンテンツを管理
 */
const SITE_DATA = {
    about: {
        description: `Minecraftを中心としたゲーム実況で活動する4人のクリエイター集団。<br>
        建築、PvP、レッドストーン、サバイバル...<br>
        それぞれの得意分野を活かし、バーチャルな世界で
        「最高に楽しい」瞬間を作り出します。
        <br><br>
        予測不能なドタバタ劇から、感動の超大作まで。<br>
        私たちの冒険はまだ始まったばかりです。`,
        stats: {
            creators: 4,
            videos: 100
        }
    },
    footer: {
        copyright: "&copy; 2026 ふぉーかす！ All Rights Reserved."
    },
    news: [
        {
            date: "2024.XX.XX",
            title: "新企画「ハードコアサバイバル」始動！",
            excerpt: "全員参加の大型企画がついにスタート。果たして生き残るのは誰だ！？",
            link: "#",
            featured: true,
            image: "placeholder" // 実際にはHTML側でdiv.news-placeholderとなっていたため
        },
        {
            date: "2024.XX.XX",
            title: "サイトオープン",
            excerpt: "ふぉーかす！の公式サイトがオープンしました。わぁカス",
            link: "#",
            featured: false,
            image: "placeholder"
        }
    ],
    members: [
        {
            name: "うのはな",
            role: "Creator",
            image: "../素材/テスト用ちびキャラ/unohana.png",
            color: "var(--color-member-2)", // Yellow
            detail: "準備中<br>うのはなの詳細プロフィールが入ります。"
        },
        {
            name: "窓ロ",
            role: "Creator",
            image: "../素材/テスト用ちびキャラ/madoro.png",
            color: "var(--color-member-3)", // Orange
            detail: "準備中<br>窓ロの詳細プロフィールが入ります。"
        },
        {
            name: "かんざき×",
            role: "Creator",
            image: "../素材/テスト用ちびキャラ/kanzaki.png",
            color: "var(--color-member-4)", // Blue
            detail: "準備中<br>かんざき×の詳細プロフィールが入ります。"
        },
        {
            name: "くろろ",
            role: "Creator",
            image: "../素材/テスト用ちびキャラ/kuroro.png",
            color: "var(--color-member-1)", // Red
            detail: "準備中<br>くろろの詳細プロフィールが入ります。"
        }
    ]
};
