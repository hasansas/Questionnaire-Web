// utils/mockPublicData.ts
// Phase 1 public mock data (snake_case keys)

export type QuestionnaireStatus = 'published'
export type QuestionnaireLanguage = 'id' | 'en'
export type ScoringType = 'multi_dimension' | 'total_score'
export type QuestionType = 'single_choice'
export type BandLevel = 'Low' | 'Medium' | 'High'
export type MeaningRuleType = 'band_combo' | 'dominant_dimension' | 'fallback'
export type ScoreBandScope = 'dimension' | 'total'

export interface Questionnaire {
  id: string
  code: string
  title: string
  description: string
  language: QuestionnaireLanguage
  status: QuestionnaireStatus
  version: number
  scoring_type: ScoringType
  show_result_to_user: boolean
}

export interface QuestionnaireDimension {
  id: string
  questionnaire_id: string
  dimension_code: 'visual' | 'auditori' | 'kinestetik'
  title: string
  description: string
  sort_order: number
}

export interface QuestionnaireQuestion {
  id: string
  questionnaire_id: string
  question_type: QuestionType
  question_text: string
  sort_order: number
  is_required: boolean
}

export interface QuestionnaireOption {
  id: string
  question_id: string
  label: string
  score_value: number
  sort_order: number
}

export interface QuestionnaireQuestionDimensionMap {
  id: string
  questionnaire_id: string
  question_id: string
  dimension_code: 'visual' | 'auditori' | 'kinestetik'
}

export interface QuestionnaireScoreBand {
  id: string
  questionnaire_id: string
  scope: ScoreBandScope
  dimension_code: 'visual' | 'auditori' | 'kinestetik' | null
  band_code: 'low' | 'medium' | 'high'
  band_label: BandLevel
  min_score: number
  max_score: number
  sort_order: number
}

export interface QuestionnaireMeaning {
  id: string
  questionnaire_id: string
  rule_type: MeaningRuleType
  // For band_combo:
  bands_json?: {
    visual: BandLevel
    auditori: BandLevel
    kinestetik: BandLevel
  }
  // For dominant_dimension:
  dominant_dimension?: 'visual' | 'auditori' | 'kinestetik'
  result_label: string
  description: string
  recommendations: string[]
  priority: number
}

export interface QuestionnaireUserField {
  id: string
  field_key: string
  label: string
  field_type: 'text' | 'number' | 'select' | 'date' | 'email' | 'phone' | 'textarea'
  placeholder?: string
  helper_text?: string
  validation_json?: {
    min_length?: number
    max_length?: number
    regex?: string
    min?: number
    max?: number
  }
}

export interface QuestionnaireUserFieldConfig {
  id: string
  questionnaire_id: string
  user_field_id: string
  sort_order: number
  is_required: boolean
  overrides_json?: {
    label?: string
    placeholder?: string
    helper_text?: string
    validation_json?: {
      min_length?: number
      max_length?: number
      regex?: string
      min?: number
      max?: number
    }
  }
}

export interface Organization {
  id: string
  name: string
  code: string
}

export const organizations: Organization[] = [
  { id: 'org-001', name: 'SMA Negeri 1 Jakarta', code: 'SMA1JKT' },
  { id: 'org-002', name: 'SMP Negeri 5 Bandung', code: 'SMP5BDG' },
  { id: 'org-003', name: 'SD Islam Al-Hikmah', code: 'SDALH' },
  { id: 'org-004', name: 'SMK Teknologi Nusantara', code: 'SMKTN' },
  { id: 'org-005', name: 'Bimbingan Belajar Cerdas', code: 'BBCERDAS' },
  { id: 'org-006', name: 'Yayasan Pendidikan Harapan', code: 'YPH' },
  { id: 'org-007', name: 'Sekolah Global Mandiri', code: 'SGM' },
  { id: 'org-008', name: 'Kampus Kreatif Indonesia', code: 'KKI' },
  { id: 'org-009', name: 'Pusat Konseling Belajar', code: 'PKB' },
  { id: 'org-010', name: 'Komunitas Guru Inovatif', code: 'KGI' },
  { id: 'org-011', name: 'SMA Kristen Bintang', code: 'SMAKB' },
  { id: 'org-012', name: 'SMP Harapan Bangsa', code: 'SMPHB' },
  { id: 'org-013', name: 'SD Negeri 7 Surabaya', code: 'SD7SBY' },
  { id: 'org-014', name: 'SMK Bisnis Modern', code: 'SMKBM' },
  { id: 'org-015', name: 'Akademi Bahasa & Sains', code: 'ABS' },
]

/**
 * SB - Kuesioner Gaya Belajar (from uploaded xlsx)
 */
export const questionnaires: Questionnaire[] = [
  {
    id: 'q-gb-001',
    code: 'GB001',
    title: 'SB - Kuesioner Gaya Belajar',
    description:
      'Kuesioner untuk mengidentifikasi gaya belajar: Visual, Auditori, dan Kinestetik.',
    language: 'id',
    status: 'published',
    version: 1,
    scoring_type: 'multi_dimension',
    show_result_to_user: true,
  },
]

export const questionnaire_dimensions: QuestionnaireDimension[] = [
  {
    id: 'dim-gb-visual',
    questionnaire_id: 'q-gb-001',
    dimension_code: 'visual',
    title: 'Visual',
    description: 'Lebih mudah memahami informasi dengan melihat/teks/gambar.',
    sort_order: 1,
  },
  {
    id: 'dim-gb-auditori',
    questionnaire_id: 'q-gb-001',
    dimension_code: 'auditori',
    title: 'Auditori',
    description: 'Lebih mudah memahami informasi dengan mendengar/berbicara.',
    sort_order: 2,
  },
  {
    id: 'dim-gb-kinestetik',
    questionnaire_id: 'q-gb-001',
    dimension_code: 'kinestetik',
    title: 'Kinestetik',
    description: 'Lebih mudah memahami informasi dengan praktik/gerak/alat peraga.',
    sort_order: 3,
  },
]

const Q = (no: number) => `q-gb-001-${String(no).padStart(2, '0')}`

export const questionnaire_questions: QuestionnaireQuestion[] = [
  { id: Q(1), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya sering lupa dengan apa yang disampaikan oleh guru jika saya tidak mencatatnya', sort_order: 1, is_required: true },
  { id: Q(2), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih senang membaca dalam hati dengan jelas', sort_order: 2, is_required: true },
  { id: Q(3), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih mudah mengingat materi pelajaran dengan mendengarkan penjelasan guru yang disampaikan secara langsung', sort_order: 3, is_required: true },
  { id: Q(4), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Ketika sedang belajar, saya lebih senang menghafal dengan suara keras dari pada menghafal dalam hati', sort_order: 4, is_required: true },
  { id: Q(5), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya sangat sering menjawab pertanyaan guru sambil menggerakkan tangan dan bagian tubuh lainnya', sort_order: 5, is_required: true },
  { id: Q(6), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Ketika membaca buku, saya sering menggunakan jari sebagai alat tunjuknya', sort_order: 6, is_required: true },
  { id: Q(7), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Dalam mengoperasikan peralatan baru, saya lebih senang bertanya kepada orang lain mengenai instruksinya', sort_order: 7, is_required: true },
  { id: Q(8), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saat belajar, saya sering melakukan hal-hal seperti : mengetuk ngetuk pulpen, menggoyangkan kaki, memainkan tangan, mengunyah, dll', sort_order: 8, is_required: true },
  { id: Q(9), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih mudah mengingat wajah seseorang dibandingkan harus mengingat namanya', sort_order: 9, is_required: true },
  { id: Q(10), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Gambar - gambar yang ada pada poster atau buku pelajaran sangat membantu saya dalam memahami materi', sort_order: 10, is_required: true },
  { id: Q(11), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saat memasak, biasanya saya mengikuti naluri dan mencoba rasa masakannya secara langsung', sort_order: 11, is_required: true },
  { id: Q(12), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Dalam menjelaskan sesuatu, saya lebih sering memperagakannya terlebih dahulu lalu meminta orang tersebut untuk langsung mempraktekkannya', sort_order: 12, is_required: true },
  { id: Q(13), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya merasa jenuh untuk duduk belajar terlalu lama di kelas', sort_order: 13, is_required: true },
  { id: Q(14), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Untuk menjelaskan sesuatu kepada orang lain, biasanya saya menuliskan instruksinya terlebih dahulu', sort_order: 14, is_required: true },
  { id: Q(15), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya tidak mengalami kesulitan belajar di tempat yang cukup ramai', sort_order: 15, is_required: true },
  { id: Q(16), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya mudah mengingat alunan nada irama tertentu', sort_order: 16, is_required: true },
  { id: Q(17), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih mudah mengingat nama orang dibandingkan wajah orangnya', sort_order: 17, is_required: true },
  { id: Q(18), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya sangat antusias untuk membuat atau memperbaiki sesuatu dengan tangan saya sendiri', sort_order: 18, is_required: true },
  { id: Q(19), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saat lebih senang mendengarkan musik dibandingkan dengan membaca untuk mengisi waktu luang saya', sort_order: 19, is_required: true },
  { id: Q(20), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih sering meminta rekomendasi pada karyawan toko saat akan membeli baju', sort_order: 20, is_required: true },
  { id: Q(21), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Dalam mengoperasikan peralatan baru, saya akan membaca instruksinya dengan jelas terlebih dahulu', sort_order: 21, is_required: true },
  { id: Q(22), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saat memulai memasak, saya membaca resepnya terlebih dahulu dengan seksama', sort_order: 22, is_required: true },
  { id: Q(23), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya terbiasa menjelaskan sesuatu dengan menyampaikannya secara langsung dengan jelas', sort_order: 23, is_required: true },
  { id: Q(24), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya bisa belajar dengan baik dalam suasana tenang', sort_order: 24, is_required: true },
  { id: Q(25), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Jika ada peralatan baru, saya lebih senang langsung mencoba dan belajar saat mencobanya', sort_order: 25, is_required: true },
  { id: Q(26), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya akan lebih mudah mengingat materi yang disampaikan dengan demonstrasi langsung atau dengan alat peraga', sort_order: 26, is_required: true },
  { id: Q(27), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya sering menghafal palajaran sambil berjalan-jalan', sort_order: 27, is_required: true },
  { id: Q(28), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih senang bertanya kepada orang lain mengenali resep makanan tertentu', sort_order: 28, is_required: true },
  { id: Q(29), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saat akan membeli baju, saya lebih sering membayangkan bagaimana penampilan saya saat memakai baju tersebut', sort_order: 29, is_required: true },
  { id: Q(30), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya senang memberikan stabilo atau garis berwarna pada kalimat yang penting dalam buku materi pembelajaran', sort_order: 30, is_required: true },
  { id: Q(31), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Ketika akan membeli baju, biasanya saya langsung mencoba dan melihat kecocokannya dan merasakan kualitas bahannya', sort_order: 31, is_required: true },
  { id: Q(32), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih mudah mengingat materi yang disertai dengan banyak gambar, diagram, poster, berwarna dan menarik', sort_order: 32, is_required: true },
  { id: Q(33), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya senang mencatat dengan rapih, menarik, dan berwarna', sort_order: 33, is_required: true },
  { id: Q(34), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Mendengarkan cerita jauh lebih menyenangkan dibandingkan dengan membaca buku', sort_order: 34, is_required: true },
  { id: Q(35), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya terbiasa membaca materi dengan menggerakkan bibir atau dengan mengeluarkan suara', sort_order: 35, is_required: true },
  { id: Q(36), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya senang melakukan kegiatan yang behubungan dengan fisik, misalnya olah raga, menggambar, membuat kreativitas tertentu, dll', sort_order: 36, is_required: true },
  { id: Q(37), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya akan belajar lebih baik, jika saya dapat menyentuh objek pembelajaran tersebut atau ketika saya belajar di bengkel belajar', sort_order: 37, is_required: true },
  { id: Q(38), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya merasa sangat mudah terganggu dengan suara suara ketika saya sedang belajar', sort_order: 38, is_required: true },
  { id: Q(39), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih suka berbicara langsung melalui telepon dengan teman saya', sort_order: 39, is_required: true },
  { id: Q(40), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih mudah mengingat pelajaran dengan membaca buku atau melihat gambar dibandingkan dengan mendengarkan penjelasan guru', sort_order: 40, is_required: true },
  { id: Q(41), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya sangat tertarik ketika belajar dengan alat peraga', sort_order: 41, is_required: true },
  { id: Q(42), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya tidak merasa terganggu dengan suara suara yang ada, ketika saya sedang belajar', sort_order: 42, is_required: true },
  { id: Q(43), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya lebih senang berkirim pesan singkat atau email dengan teman saya', sort_order: 43, is_required: true },
  { id: Q(44), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya senang mendengarkan penjelasan orang lain karena itu membantu saya memahami pelajaran', sort_order: 44, is_required: true },
  { id: Q(45), questionnaire_id: 'q-gb-001', question_type: 'single_choice', question_text: 'Saya sangat menyukai bertemu langsung dan melakukan suatu hal yang positif dengan teman saya', sort_order: 45, is_required: true },
]

/**
 * Options are identical for every question (xlsx: Setuju=2, Ragu=1, Tidak Setuju=0)
 */
export const questionnaire_options: QuestionnaireOption[] = questionnaire_questions.flatMap((q) => [
  { id: `opt-${q.id}-1`, question_id: q.id, label: 'Setuju', score_value: 2, sort_order: 1 },
  { id: `opt-${q.id}-2`, question_id: q.id, label: 'Ragu', score_value: 1, sort_order: 2 },
  { id: `opt-${q.id}-3`, question_id: q.id, label: 'Tidak Setuju', score_value: 0, sort_order: 3 },
])

/**
 * Mapping question -> dimension
 * From xlsx "Skor" sheet: 15 questions each
 */
const VISUAL_Q = [1, 2, 9, 10, 14, 15, 21, 22, 29, 30, 32, 33, 40, 42, 43]
const AUDITORI_Q = [3, 4, 7, 16, 17, 19, 20, 23, 24, 28, 34, 35, 38, 39, 44]
const KINESTETIK_Q = [5, 6, 8, 11, 12, 13, 18, 25, 26, 27, 31, 36, 37, 41, 45]

export const questionnaire_question_dimension_maps: QuestionnaireQuestionDimensionMap[] = [
  ...VISUAL_Q.map((no) => ({
    id: `map-gb-visual-${no}`,
    questionnaire_id: 'q-gb-001',
    question_id: Q(no),
    dimension_code: 'visual' as const,
  })),
  ...AUDITORI_Q.map((no) => ({
    id: `map-gb-auditori-${no}`,
    questionnaire_id: 'q-gb-001',
    question_id: Q(no),
    dimension_code: 'auditori' as const,
  })),
  ...KINESTETIK_Q.map((no) => ({
    id: `map-gb-kinestetik-${no}`,
    questionnaire_id: 'q-gb-001',
    question_id: Q(no),
    dimension_code: 'kinestetik' as const,
  })),
]

/**
 * Bands from xlsx "Skor" sheet (per dimension, max 30):
 * 0–10 Low, 11–20 Medium, 21–30 High
 */
export const questionnaire_score_bands: QuestionnaireScoreBand[] = [
  // visual
  { id: 'band-gb-visual-low', questionnaire_id: 'q-gb-001', scope: 'dimension', dimension_code: 'visual', band_code: 'low', band_label: 'Low', min_score: 0, max_score: 10, sort_order: 1 },
  { id: 'band-gb-visual-medium', questionnaire_id: 'q-gb-001', scope: 'dimension', dimension_code: 'visual', band_code: 'medium', band_label: 'Medium', min_score: 11, max_score: 20, sort_order: 2 },
  { id: 'band-gb-visual-high', questionnaire_id: 'q-gb-001', scope: 'dimension', dimension_code: 'visual', band_code: 'high', band_label: 'High', min_score: 21, max_score: 30, sort_order: 3 },

  // auditori
  { id: 'band-gb-auditori-low', questionnaire_id: 'q-gb-001', scope: 'dimension', dimension_code: 'auditori', band_code: 'low', band_label: 'Low', min_score: 0, max_score: 10, sort_order: 1 },
  { id: 'band-gb-auditori-medium', questionnaire_id: 'q-gb-001', scope: 'dimension', dimension_code: 'auditori', band_code: 'medium', band_label: 'Medium', min_score: 11, max_score: 20, sort_order: 2 },
  { id: 'band-gb-auditori-high', questionnaire_id: 'q-gb-001', scope: 'dimension', dimension_code: 'auditori', band_code: 'high', band_label: 'High', min_score: 21, max_score: 30, sort_order: 3 },

  // kinestetik
  { id: 'band-gb-kinestetik-low', questionnaire_id: 'q-gb-001', scope: 'dimension', dimension_code: 'kinestetik', band_code: 'low', band_label: 'Low', min_score: 0, max_score: 10, sort_order: 1 },
  { id: 'band-gb-kinestetik-medium', questionnaire_id: 'q-gb-001', scope: 'dimension', dimension_code: 'kinestetik', band_code: 'medium', band_label: 'Medium', min_score: 11, max_score: 20, sort_order: 2 },
  { id: 'band-gb-kinestetik-high', questionnaire_id: 'q-gb-001', scope: 'dimension', dimension_code: 'kinestetik', band_code: 'high', band_label: 'High', min_score: 21, max_score: 30, sort_order: 3 },
]

// Descriptions copied/condensed from xlsx "Arti Skor"
const DESC_VISUAL =
  'Siswa dengan gaya belajar VISUAL cenderung lebih mudah memahami informasi yang didapat dengan cara melihat atau mengamati sebuah gambar, diagram, peta, poster, dan data teks dalam bentuk tulisan atau huruf. Siswa dengan gaya belajar ini lebih menyukai membaca sendiri daripada dibacakan, karena ia lebih mudah mengingat apa yang ia baca. Selain itu, ia cenderung lebih rapi dan teratur. Namun, ia sering mengalami kesulitan dalam mengingat intruksi yang disampaikan secara verbal.'

const DESC_AUDITORI =
  'Siswa dengan gaya belajar AUDITORI cenderung mengandalkan pendengaran dan pembicaraan. Dalam belajar, siswa lebih mudah menerima, memahami, dan mengingat informasi dengan mendengarkan penjelasan yang diberikan. Siswa dengan gaya belajar ini cenderung aktif berbicara, dan peka terhadap nada dan irama. Ia tidak menyukai membaca dalam hati, saat membaca ia biasanya menggerakkan bibirnya atau membaca dengan mengeluarkan suara. Selain itu, ia biasanya mengalami kesulitan dalam menulis namun hebat dalam memberi penjelasan atau bercerita.'

const DESC_KINESTETIK =
  'Siswa dengan gaya belajar KINESTETIK, cenderung belajar sambil menggerakkan anggota tubuhnya, ia sering menghafal sambil berjalan, atau belajar sambil memainkan jemari tangannya. Selain itu, ia juga sangat menyukai belajar dengan alat peraga dan praktek langsung. Siswa dengan gaya belajar ini cenderung aktif dan sulit duduk diam dalam jangka waktu tertentu.'

const DESC_VISUAL_AUDITORI =
  'Siswa dengan gaya belajar VISUAL AUDITORI cenderung belajar dengan mengamati, melihat dan mendengarkan. Ia akan lebih mudah mengingat informasi yang disampaikan secara tertulis atau dijelaskan secara langsung. Siswa dengan gaya belajar ini biasanya senang membaca, mendengarkan, dan juga senang berbicara. Namun, biasanya ia mengalami kesulitan jika harus melakukan praktek langsung atau memperbaiki sesuatu.'

const DESC_VISUAL_KINESTETIK =
  'Siswa dengan gaya belajar VISUAL KINESTETIK cenderung lebih mudah memahami informasi dengan cara melihat atau mengamati secara langsung melalui buku, video, atau dengan alat peraga. Siswa dengan gaya belajar ini biasanya membaca sambil menggerakkan tangan, kaki, atau anggota tubuh lainnya. Membaca sambil berjalan-jalan biasanya akan lebih memudahkan siswa untuk menghafal pelajaran. Ia juga tertarik dengan gambar, diagram, dan poster yang berwarna dan menarik.'

const DESC_AUDITORI_KINESTETIK =
  'Siswa dengan gaya belajar AUDITORI KINESTETIK cenderung senang belajar dengan menggunakan alat peraga atau praktek langsung, ia juga biasanya mengandalkan pendengarannya untuk memahami sesuatu. Siswa dengan gaya belajar ini cenderung aktif berbicara, peka terhadap nada dan irama, dan cenderung sulit untuk duduk diam dalam jangka waktu tertentu. Ia membaca dengan mengeluarkan suara, dan belajar sambil menggerakkan anggota tubuhnya. Biasanya, ia mengalami kesulitan dalam menulis, namun hebat dalam memperagakan sesuatu.'

const DESC_KONSULTASI =
  'Skor Anda terlihat merata/ambigu di beberapa dimensi. Disarankan konsultasi atau tes ulang untuk memastikan gaya belajar yang paling dominan.'

// Helper to keep deterministic priority order (xlsx row order)
const M = (
  id: string,
  v: BandLevel,
  a: BandLevel,
  k: BandLevel,
  label: string,
  description: string,
  recommendations: string[],
  priority: number,
): QuestionnaireMeaning => ({
  id,
  questionnaire_id: 'q-gb-001',
  rule_type: 'band_combo',
  bands_json: { visual: v, auditori: a, kinestetik: k },
  result_label: label,
  description,
  recommendations,
  priority,
})

export const questionnaire_meanings: QuestionnaireMeaning[] = [
  // 1) High High High -> Konsultasi / Tes ulang
  M(
    'mean-gb-01',
    'High',
    'High',
    'High',
    'Konsultasi / Tes ulang',
    DESC_KONSULTASI,
    ['Ulangi tes saat kondisi fokus.', 'Diskusikan hasil dengan guru/konselor.', 'Coba 3 metode belajar dan bandingkan.', 'Gunakan jurnal belajar 7 hari.'],
    1,
  ),

  // 2) High High Medium -> VISUAL AUDITORI
  M('mean-gb-02', 'High', 'High', 'Medium', 'VISUAL AUDITORI', DESC_VISUAL_AUDITORI, ['Gunakan catatan visual + penjelasan lisan.', 'Rekam penjelasan penting untuk diulang.', 'Ringkas materi jadi mind-map.', 'Tambah latihan praktik ringan.'], 2),
  // 3) High High Low -> VISUAL AUDITORI
  M('mean-gb-03', 'High', 'High', 'Low', 'VISUAL AUDITORI', DESC_VISUAL_AUDITORI, ['Belajar lewat slide/diagram + diskusi.', 'Baca materi lalu jelaskan ulang.', 'Gunakan highlight warna.', 'Tambahkan demo sederhana agar tidak pasif.'], 3),

  // 4) High Medium High -> VISUAL KINESTETIK
  M('mean-gb-04', 'High', 'Medium', 'High', 'VISUAL KINESTETIK', DESC_VISUAL_KINESTETIK, ['Pakai alat peraga + video/diagram.', 'Belajar sambil menulis/gerak ringan.', 'Praktik langsung setelah membaca.', 'Gunakan flashcard bergambar.'], 4),

  // 5) High Medium Medium -> VISUAL
  M('mean-gb-05', 'High', 'Medium', 'Medium', 'VISUAL', DESC_VISUAL, ['Gunakan diagram, peta konsep, warna.', 'Buat catatan rapi dan terstruktur.', 'Baca mandiri sebelum kelas.', 'Konfirmasi instruksi verbal lewat tulisan.'], 5),

  // 6) High Medium Low -> VISUAL AUDITORI
  M('mean-gb-06', 'High', 'Medium', 'Low', 'VISUAL AUDITORI', DESC_VISUAL_AUDITORI, ['Gunakan handout + penjelasan guru.', 'Tanya jawab untuk memperkuat ingatan.', 'Ringkas jadi poin-poin.', 'Coba praktik kecil agar lebih nempel.'], 6),

  // 7) High Low High -> VISUAL KINESTETIK
  M('mean-gb-07', 'High', 'Low', 'High', 'VISUAL KINESTETIK', DESC_VISUAL_KINESTETIK, ['Belajar lewat demonstrasi + visual.', 'Bagi materi jadi sesi pendek.', 'Gunakan alat peraga saat menghafal.', 'Buat poster ringkas.'], 7),

  // 8) High Low Medium -> VISUAL KINESTETIK
  M('mean-gb-08', 'High', 'Low', 'Medium', 'VISUAL KINESTETIK', DESC_VISUAL_KINESTETIK, ['Gunakan video/diagram berwarna.', 'Latihan lewat simulasi sederhana.', 'Catat poin kunci sambil bergerak.', 'Gunakan contoh nyata.'], 8),

  // 9) High Low Low -> VISUAL
  M('mean-gb-09', 'High', 'Low', 'Low', 'VISUAL', DESC_VISUAL, ['Utamakan bahan tertulis & gambar.', 'Kurangi distraksi suara saat belajar.', 'Gunakan highlight dan ikon.', 'Minta instruksi tertulis dari guru.'], 9),

  // 10) Medium High High -> AUDITORI KINESTETIK
  M('mean-gb-10', 'Medium', 'High', 'High', 'AUDITORI KINESTETIK', DESC_AUDITORI_KINESTETIK, ['Belajar lewat diskusi + praktik.', 'Gunakan role-play/simulasi.', 'Baca dengan suara pelan.', 'Gunakan jeda gerak tiap 20 menit.'], 10),

  // 11) Medium High Medium -> AUDITORI
  M('mean-gb-11', 'Medium', 'High', 'Medium', 'AUDITORI', DESC_AUDITORI, ['Dengarkan penjelasan dan ulangi verbal.', 'Gunakan podcast/rekaman materi.', 'Belajar kelompok: tanya jawab.', 'Bacakan ringkasan dengan suara.'], 11),

  // 12) Medium High Low -> VISUAL AUDITORI
  M('mean-gb-12', 'Medium', 'High', 'Low', 'VISUAL AUDITORI', DESC_VISUAL_AUDITORI, ['Kombinasikan membaca + diskusi.', 'Gunakan catatan dan rekaman.', 'Buat ringkasan 1 halaman.', 'Tambah latihan praktik kecil.'], 12),

  // 13) Medium Medium High -> KINESTETIK
  M('mean-gb-13', 'Medium', 'Medium', 'High', 'KINESTETIK', DESC_KINESTETIK, ['Belajar lewat praktik dan alat peraga.', 'Gunakan aktivitas hands-on.', 'Buat eksperimen mini.', 'Sisipkan gerak saat menghafal.'], 13),

  // 14) Medium Medium Medium -> Konsultasi / Tes ulang
  M(
    'mean-gb-14',
    'Medium',
    'Medium',
    'Medium',
    'Konsultasi / Tes ulang',
    DESC_KONSULTASI,
    ['Ulangi tes 1–2 minggu lagi.', 'Coba metode belajar campuran.', 'Cari pola mana paling efektif.', 'Diskusikan dengan guru/konselor.'],
    14,
  ),

  // 15) Medium Medium Low -> VISUAL AUDITORI
  M('mean-gb-15', 'Medium', 'Medium', 'Low', 'VISUAL AUDITORI', DESC_VISUAL_AUDITORI, ['Gunakan bahan tertulis + penjelasan.', 'Latih presentasi singkat materi.', 'Buat mind-map.', 'Tambah praktik sederhana.'], 15),

  // 16) Medium Low High -> VISUAL KINESTETIK
  M('mean-gb-16', 'Medium', 'Low', 'High', 'VISUAL KINESTETIK', DESC_VISUAL_KINESTETIK, ['Gunakan alat peraga + gambar.', 'Praktik langsung setelah membaca.', 'Belajar sambil bergerak ringan.', 'Gunakan contoh nyata.'], 16),

  // 17) Medium Low Medium -> VISUAL KINESTETIK
  M('mean-gb-17', 'Medium', 'Low', 'Medium', 'VISUAL KINESTETIK', DESC_VISUAL_KINESTETIK, ['Gunakan video/diagram.', 'Latihan dengan proyek kecil.', 'Buat catatan visual singkat.', 'Gunakan flashcard bergambar.'], 17),

  // 18) Medium Low Low -> VISUAL
  M('mean-gb-18', 'Medium', 'Low', 'Low', 'VISUAL', DESC_VISUAL, ['Fokus pada membaca & visual.', 'Buat catatan rapi dan berwarna.', 'Gunakan gambar/diagram.', 'Minta instruksi tertulis.'], 18),

  // 19) Low High High -> AUDITORI KINESTETIK
  M('mean-gb-19', 'Low', 'High', 'High', 'AUDITORI KINESTETIK', DESC_AUDITORI_KINESTETIK, ['Belajar dengan diskusi + praktik.', 'Gunakan simulasi/role-play.', 'Baca dengan suara.', 'Hindari duduk terlalu lama.'], 19),

  // 20) Low High Medium -> AUDITORI KINESTETIK
  M('mean-gb-20', 'Low', 'High', 'Medium', 'AUDITORI KINESTETIK', DESC_AUDITORI_KINESTETIK, ['Diskusi aktif + latihan langsung.', 'Gunakan alat peraga.', 'Rekam instruksi guru.', 'Gunakan jeda gerak terjadwal.'], 20),

  // 21) Low High Low -> AUDITORI
  M('mean-gb-21', 'Low', 'High', 'Low', 'AUDITORI', DESC_AUDITORI, ['Belajar lewat mendengar.', 'Ulangi dengan cerita sendiri.', 'Gunakan audio note.', 'Bacakan ringkasan.'], 21),

  // 22) Low Medium High -> AUDITORI KINESTETIK
  M('mean-gb-22', 'Low', 'Medium', 'High', 'AUDITORI KINESTETIK', DESC_AUDITORI_KINESTETIK, ['Praktik langsung + instruksi lisan.', 'Belajar sambil bergerak.', 'Gunakan alat peraga.', 'Diskusi singkat setelah praktik.'], 22),

  // 23) Low Medium Medium -> AUDITORI KINESTETIK
  M('mean-gb-23', 'Low', 'Medium', 'Medium', 'AUDITORI KINESTETIK', DESC_AUDITORI_KINESTETIK, ['Kombinasikan demo + diskusi.', 'Gunakan rekaman dan alat peraga.', 'Baca dengan suara pelan.', 'Sesi belajar pendek dan aktif.'], 23),

  // 24) Low Medium Low -> AUDITORI
  M('mean-gb-24', 'Low', 'Medium', 'Low', 'AUDITORI', DESC_AUDITORI, ['Dengarkan materi utama.', 'Tanya jawab untuk memperjelas.', 'Gunakan podcast/video penjelasan.', 'Ulangi dengan suara.'], 24),

  // 25) Low Low High -> KINESTETIK
  M('mean-gb-25', 'Low', 'Low', 'High', 'KINESTETIK', DESC_KINESTETIK, ['Belajar lewat praktik.', 'Gunakan alat peraga.', 'Buat proyek mini.', 'Gerakkan tubuh saat menghafal.'], 25),

  // 26) Low Low Medium -> KINESTETIK
  M('mean-gb-26', 'Low', 'Low', 'Medium', 'KINESTETIK', DESC_KINESTETIK, ['Latihan hands-on rutin.', 'Gunakan eksperimen kecil.', 'Belajar dengan simulasi.', 'Sisipkan aktivitas fisik.'], 26),

  // 27) Low Low Low -> Konsultasi / Tes ulang
  M(
    'mean-gb-27',
    'Low',
    'Low',
    'Low',
    'Konsultasi / Tes ulang',
    DESC_KONSULTASI,
    ['Ulangi tes saat mood stabil.', 'Periksa apakah menjawab terlalu netral.', 'Coba observasi gaya belajar 1 minggu.', 'Diskusikan dengan pendamping belajar.'],
    27,
  ),

  // Fallback (should rarely happen)
  {
    id: 'mean-gb-fallback',
    questionnaire_id: 'q-gb-001',
    rule_type: 'fallback',
    result_label: 'Gaya Belajar Campuran',
    description: 'Gaya belajar Anda bersifat campuran. Coba beberapa metode dan lihat mana yang paling efektif.',
    recommendations: ['Coba visual + audio + praktik.', 'Gunakan catatan ringkas.', 'Evaluasi hasil latihan.', 'Sesuaikan durasi belajar.'],
    priority: 999,
  },
]

/**
 * Dynamic User Info (minimal, admin-configurable style)
 * Organization is recommended required (use v-autocomplete with organizations)
 */
export const questionnaire_user_fields: QuestionnaireUserField[] = [
  {
    id: 'uf-full_name',
    field_key: 'full_name',
    label: 'Nama Lengkap',
    field_type: 'text',
    placeholder: 'Contoh: Budi Santoso',
    helper_text: 'Gunakan nama asli untuk laporan yang akurat.',
    validation_json: { min_length: 2, max_length: 60 },
  },
  {
    id: 'uf-email',
    field_key: 'email',
    label: 'Email',
    field_type: 'email',
    placeholder: 'nama@email.com',
    helper_text: 'Kami gunakan untuk kebutuhan laporan (jika diperlukan).',
    validation_json: { regex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
  },
  {
    id: 'uf-phone',
    field_key: 'phone',
    label: 'Nomor WhatsApp',
    field_type: 'phone',
    placeholder: '08xxxxxxxxxx',
    helper_text: 'Opsional, hanya untuk follow-up jika diperlukan.',
    validation_json: { regex: '^[0-9+\\-\\s]{8,20}$' },
  },
  {
    id: 'uf-organization_id',
    field_key: 'organization_id',
    label: 'Organisasi / Sekolah',
    field_type: 'select',
    placeholder: 'Cari dan pilih organisasi',
    helper_text: 'Wajib diisi.',
  },
  {
    id: 'uf-birth_date',
    field_key: 'birth_date',
    label: 'Tanggal Lahir',
    field_type: 'date',
    helper_text: 'Opsional.',
  },
  {
    id: 'uf-notes',
    field_key: 'notes',
    label: 'Catatan Tambahan',
    field_type: 'textarea',
    placeholder: 'Contoh: kesulitan fokus, target belajar, dsb.',
    helper_text: 'Opsional.',
    validation_json: { max_length: 200 },
  },
]

export const questionnaire_user_field_configs: QuestionnaireUserFieldConfig[] = [
  // For GB001 (ordered)
  { id: 'ufc-gb-01', questionnaire_id: 'q-gb-001', user_field_id: 'uf-full_name', sort_order: 1, is_required: true },
  { id: 'ufc-gb-02', questionnaire_id: 'q-gb-001', user_field_id: 'uf-organization_id', sort_order: 2, is_required: true },
  { id: 'ufc-gb-03', questionnaire_id: 'q-gb-001', user_field_id: 'uf-email', sort_order: 3, is_required: true },
  { id: 'ufc-gb-04', questionnaire_id: 'q-gb-001', user_field_id: 'uf-phone', sort_order: 4, is_required: false },
  { id: 'ufc-gb-05', questionnaire_id: 'q-gb-001', user_field_id: 'uf-birth_date', sort_order: 5, is_required: false },
  { id: 'ufc-gb-06', questionnaire_id: 'q-gb-001', user_field_id: 'uf-notes', sort_order: 6, is_required: false },
]
