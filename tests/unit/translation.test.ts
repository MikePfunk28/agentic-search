import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LanguageDetector } from '../../src/lib/translation/detector';
import { TranslationService } from '../../src/lib/translation/service';
import { QueryTranslator } from '../../src/lib/translation/query-translator';
import type { SupportedLanguage } from '../../src/lib/translation/types';
import { ModelProvider } from '../../src/lib/model-config';

describe('LanguageDetector', () => {
	let detector: LanguageDetector;

	beforeEach(() => {
		detector = new LanguageDetector();
	});

	describe('Language Detection', () => {
		it('should detect Chinese correctly using character sets', () => {
			const result = detector.detect('你好，今天怎么样？我想了解更多关于编程的信息');
			expect(result.language).toBe('zh');
			expect(result.characterSets).toContain('cjk-chinese');
		});

		it('should detect Japanese correctly using hiragana/katakana', () => {
			const result = detector.detect('こんにちは、お元気ですか？プログラミングについてもっと知りたいです');
			expect(result.language).toBe('ja');
			expect(result.characterSets.some(s => ['hiragana', 'katakana'].includes(s))).toBe(true);
		});

		it('should detect Korean correctly using hangul', () => {
			const result = detector.detect('안녕하세요, 오늘 어떻게 지내세요? 프로그래밍에 대해 더 알고 싶어요');
			expect(result.language).toBe('ko');
			expect(result.characterSets).toContain('hangul');
		});

		it('should detect Russian correctly using cyrillic', () => {
			const result = detector.detect('Привет, как дела сегодня? Я хотел бы узнать больше о программировании');
			expect(result.language).toBe('ru');
			expect(result.characterSets).toContain('cyrillic');
		});

		it('should detect Arabic correctly using arabic script', () => {
			const result = detector.detect('مرحبا، كيف حالك اليوم؟ أود أن أعرف المزيد عن البرمجة');
			expect(result.language).toBe('ar');
			expect(result.characterSets).toContain('arabic');
		});

		it('should return unknown for very short text', () => {
			const result = detector.detect('hi');
			expect(result.language).toBe('unknown');
		});

		it('should return unknown for empty text', () => {
			const result = detector.detect('');
			expect(result.language).toBe('unknown');
			expect(result.confidence).toBe(0);
		});
	});

	describe('Character Set Detection', () => {
		it('should detect CJK characters for Chinese', () => {
			const result = detector.detect('这是一个测试');
			expect(result.characterSets).toContain('cjk-chinese');
		});

		it('should detect Hiragana for Japanese', () => {
			const result = detector.detect('これはテストです');
			expect(result.characterSets.some(s => ['hiragana', 'katakana', 'cjk-chinese'].includes(s))).toBe(true);
		});

		it('should detect Hangul for Korean', () => {
			const result = detector.detect('이것은 테스트입니다');
			expect(result.characterSets).toContain('hangul');
		});

		it('should detect Cyrillic for Russian', () => {
			const result = detector.detect('Это тест');
			expect(result.characterSets).toContain('cyrillic');
		});

		it('should detect Arabic script', () => {
			const result = detector.detect('هذا اختبار');
			expect(result.characterSets).toContain('arabic');
		});
	});

	describe('isEnglish', () => {
		it('should return false for non-English text', () => {
			expect(detector.isEnglish('这是中文文本用于测试')).toBe(false);
		});

		it('should return false for Japanese text', () => {
			expect(detector.isEnglish('これは日本語のテキストです')).toBe(false);
		});
	});

	describe('Accuracy Tests (>95% requirement)', () => {
		const accuracyTestCases: Array<{ texts: string[]; expectedLang: SupportedLanguage; lang: string }> = [
			{
				lang: 'English',
				expectedLang: 'en',
				texts: [
					'The weather is beautiful today and I want to go outside',
					'I need to search for information about programming languages',
					'How do I fix this error in my code that keeps appearing',
					'What are the best practices for software development projects',
					'Can you help me understand this concept better please',
				],
			},
			{
				lang: 'Spanish',
				expectedLang: 'es',
				texts: [
					'El clima está hermoso hoy y quiero salir a caminar',
					'Necesito buscar información sobre programación de computadoras',
					'¿Cómo puedo arreglar este error en mi código que sigue apareciendo',
					'¿Cuáles son las mejores prácticas para el desarrollo de software',
					'¿Puedes ayudarme a entender este concepto mejor por favor',
				],
			},
			{
				lang: 'French',
				expectedLang: 'fr',
				texts: [
					'Le temps est magnifique aujourd\'hui et je veux sortir',
					'Je dois chercher des informations sur la programmation',
					'Comment puis-je corriger cette erreur dans mon code',
					'Quelles sont les meilleures pratiques pour le développement logiciel',
					'Pouvez-vous m\'aider à comprendre ce concept mieux',
				],
			},
			{
				lang: 'German',
				expectedLang: 'de',
				texts: [
					'Das Wetter ist heute wunderschön und ich möchte ausgehen',
					'Ich muss nach Informationen über Programmierung suchen',
					'Wie kann ich diesen Fehler in meinem Code beheben',
					'Was sind die besten Praktiken für die Softwareentwicklung',
					'Können Sie mir helfen dieses Konzept besser zu verstehen',
				],
			},
			{
				lang: 'Chinese',
				expectedLang: 'zh',
				texts: [
					'今天天气很好，我想出去走走',
					'我需要搜索关于计算机编程的信息',
					'如何修复我的代码中不断出现的错误',
					'软件开发项目的最佳实践是什么',
					'你能帮我更好地理解这个概念吗',
				],
			},
			{
				lang: 'Japanese',
				expectedLang: 'ja',
				texts: [
					'今日はいい天気ですね、外に出かけたいです',
					'プログラミングについて情報を検索する必要があります',
					'コードのエラーをどのように修正すればいいですか',
					'ソフトウェア開発のベストプラクティスは何ですか',
					'この概念をよりよく理解するのを手伝っていただけますか',
				],
			},
			{
				lang: 'Korean',
				expectedLang: 'ko',
				texts: [
					'오늘 날씨가 정말 좋네요, 밖에 나가고 싶어요',
					'프로그래밍에 대한 정보를 검색해야 합니다',
					'코드에서 이 오류를 어떻게 수정합니까',
					'소프트웨어 개발의 모범 사례는 무엇입니까',
					'이 개념을 이해하는 데 도와주실 수 있나요',
				],
			},
			{
				lang: 'Portuguese',
				expectedLang: 'pt',
				texts: [
					'O tempo está muito bonito hoje e eu quero sair para passear e aproveitar o ensolarado lá fora',
					'Eu preciso pesquisar informações sobre programação de computadores e desenvolvimento de aplicativos',
					'Como posso resolver este problema persistente no meu código que continua acontecer',
					'Quais são as melhores práticas recomendadas para criar aplicativos web modernos',
					'Você poderia me ajudar a entender como funciona este sistema de banco de dados',
				],
			},
			{
				lang: 'Russian',
				expectedLang: 'ru',
				texts: [
					'Сегодня прекрасная погода и я хочу выйти погулять',
					'Мне нужно найти информацию о программировании компьютеров',
					'Как исправить эту ошибку в моём коде которая продолжает появляться',
					'Какие лучшие практики разработки программного обеспечения',
					'Можете помочь мне понять эту концепцию лучше пожалуйста',
				],
			},
			{
				lang: 'Arabic',
				expectedLang: 'ar',
				texts: [
					'الطقس جميل اليوم وأريد الخروج للمشي',
					'أحتاج للبحث عن معلومات حول برمجة الحاسوب',
					'كيف يمكنني إصلاح هذا الخطأ في الكود الذي يستمر في الظهور',
					'ما هي أفضل الممارسات لتطوير البرمجيات',
					'هل يمكنك مساعدتي في فهم هذا المفهوم بشكل أفضل من فضلك',
				],
			},
		];

		for (const { lang, expectedLang, texts } of accuracyTestCases) {
			it(`should achieve >95% accuracy for ${lang}`, () => {
				let correct = 0;
				
				for (const text of texts) {
					const result = detector.detect(text);
					if (result.language === expectedLang) {
						correct++;
					}
				}
				
				const accuracy = correct / texts.length;
				expect(accuracy).toBeGreaterThanOrEqual(0.95);
			});
		}
	});
});

describe('TranslationService', () => {
	let service: TranslationService;

	beforeEach(() => {
		service = new TranslationService({ ttlMs: 60000 });
	});

	describe('Entity Preservation', () => {
		it('should extract URLs correctly', () => {
			const text = 'Visit https://example.com for more info';
			const result = (service as any).extractAndMaskEntities(text);
			
			expect(result.entities.length).toBeGreaterThan(0);
			expect(result.entities[0].type).toBe('url');
			expect(result.entities[0].text).toBe('https://example.com');
		});

		it('should extract email addresses correctly', () => {
			const text = 'Contact us at test@example.com';
			const result = (service as any).extractAndMaskEntities(text);
			
			expect(result.entities.some((e: any) => e.type === 'email')).toBe(true);
		});

		it('should extract code blocks correctly', () => {
			const text = 'Use `npm install` to install packages';
			const result = (service as any).extractAndMaskEntities(text);
			
			expect(result.entities.some((e: any) => e.type === 'code')).toBe(true);
		});

		it('should extract technical terms correctly', () => {
			const text = 'Learn React and TypeScript for frontend development';
			const result = (service as any).extractAndMaskEntities(text);
			
			expect(result.entities.some((e: any) => e.type === 'technical')).toBe(true);
		});

		it('should preserve multiple entities', () => {
			const text = 'Check https://docs.react.dev and email team@react.dev';
			const result = (service as any).extractAndMaskEntities(text);
			
			expect(result.entities.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe('Caching', () => {
		it('should cache translations', () => {
			const cacheKey = 'test-key';
			const entry = {
				translated: 'translated text',
				sourceLang: 'es' as SupportedLanguage,
				targetLang: 'en' as SupportedLanguage,
				timestamp: Date.now(),
				confidence: 0.9,
			};
			
			(service as any).setCache(cacheKey, entry);
			
			const cached = (service as any).getFromCache(cacheKey);
			expect(cached).toEqual(entry);
		});

		it('should return null for expired cache entries', () => {
			const shortTtlService = new TranslationService({ ttlMs: 100 });
			const cacheKey = 'test-key';
			const entry = {
				translated: 'translated text',
				sourceLang: 'es' as SupportedLanguage,
				targetLang: 'en' as SupportedLanguage,
				timestamp: Date.now() - 200,
				confidence: 0.9,
			};
			
			(shortTtlService as any).setCache(cacheKey, entry);
			
			const cached = (shortTtlService as any).getFromCache(cacheKey);
			expect(cached).toBeNull();
		});

		it('should clear cache', () => {
			const cacheKey = 'test-key';
			const entry = {
				translated: 'translated text',
				sourceLang: 'es' as SupportedLanguage,
				targetLang: 'en' as SupportedLanguage,
				timestamp: Date.now(),
				confidence: 0.9,
			};
			
			(service as any).setCache(cacheKey, entry);
			expect(service.getCacheSize()).toBe(1);
			
			service.clearCache();
			expect(service.getCacheSize()).toBe(0);
		});

		it('should prune expired entries', () => {
			(service as any).setCache('key1', {
				translated: 'text1',
				sourceLang: 'es' as SupportedLanguage,
				targetLang: 'en' as SupportedLanguage,
				timestamp: Date.now() - 7200000,
				confidence: 0.9,
			});
			
			(service as any).setCache('key2', {
				translated: 'text2',
				sourceLang: 'es' as SupportedLanguage,
				targetLang: 'en' as SupportedLanguage,
				timestamp: Date.now(),
				confidence: 0.9,
			});
			
			const pruned = service.pruneExpiredCache();
			expect(pruned).toBe(1);
			expect(service.getCacheSize()).toBe(1);
		});
	});

	describe('Translation without model', () => {
		it('should return original text when no model configured', async () => {
			const result = await service.translate('这是中文文本', 'en');
			
			expect(result.original).toBe('这是中文文本');
			expect(result.translated).toBe('这是中文文本');
			expect(result.cached).toBe(false);
		});

		it('should return same text for English to English', async () => {
			const result = await service.translate('The quick brown fox jumps', 'en');
			
			expect(result.original).toBe('The quick brown fox jumps');
			expect(result.translated).toBe('The quick brown fox jumps');
			expect(result.sourceLang).toBe('en');
		});
	});

	describe('Translation with mocked model', () => {
		it('should call model for translation', async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					choices: [{ message: { content: 'Hello world' } }],
				}),
			});
			
			global.fetch = mockFetch;
			
			service.setModelConfig({
				provider: ModelProvider.OPENAI,
				model: 'gpt-4',
				baseUrl: 'https://api.openai.com/v1',
				apiKey: 'test-key',
				temperature: 0.7,
				maxTokens: 4096,
				timeout: 60000,
				enableStreaming: false,
			});
			
			const result = await service.translate('你好世界', 'en', { cache: false });
			
			expect(mockFetch).toHaveBeenCalled();
			expect(result.translated).toBe('Hello world');
		});

		it('should handle API errors gracefully', async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: false,
				status: 500,
				text: async () => 'Internal Server Error',
			});
			
			global.fetch = mockFetch;
			
			service.setModelConfig({
				provider: ModelProvider.OPENAI,
				model: 'gpt-4',
				baseUrl: 'https://api.openai.com/v1',
				apiKey: 'test-key',
				temperature: 0.7,
				maxTokens: 4096,
				timeout: 60000,
				enableStreaming: false,
			});
			
			const result = await service.translate('你好世界', 'en', { cache: false });
			
			expect(result.translated).toBe('你好世界');
		});

		it('should handle timeout errors', async () => {
			const mockFetch = vi.fn().mockImplementation(() => {
				return new Promise((_, reject) => {
					setTimeout(() => reject(new Error('Timeout')), 100);
				});
			});
			
			global.fetch = mockFetch;
			
			service.setModelConfig({
				provider: ModelProvider.OPENAI,
				model: 'gpt-4',
				baseUrl: 'https://api.openai.com/v1',
				apiKey: 'test-key',
				temperature: 0.7,
				maxTokens: 4096,
				timeout: 60000,
				enableStreaming: false,
			});
			
			const result = await service.translate('你好世界', 'en', { 
				cache: false, 
				timeout: 50 
			});
			
			expect(result.translated).toBe('你好世界');
		});
	});
});

describe('QueryTranslator', () => {
	let translator: QueryTranslator;

	beforeEach(() => {
		translator = new QueryTranslator();
	});

	describe('translateQuery', () => {
		it('should detect Chinese queries', async () => {
			const result = await translator.translateQuery('如何在React中修复bug');
			
			expect(result.sourceLanguage).toBe('zh');
		});

		it('should preserve technical terms in queries', async () => {
			const entities = (translator as any).extractPreservedEntities('how to use React for development');
			expect(entities.some((e: any) => e.type === 'technical')).toBe(true);
		});

		it('should detect Japanese queries', async () => {
			const result = await translator.translateQuery('プログラミングについて情報を検索する必要があります');
			
			expect(result.sourceLanguage).toBe('ja');
		});
	});

	describe('enhanceQuery', () => {
		it('should extract search terms', async () => {
			const result = await translator.enhanceQuery('How to use Docker containers for deployment in production');
			
			expect(result.searchTerms.length).toBeGreaterThan(0);
			expect(result.searchTerms).toContain('docker');
		});
	});

	describe('Entity Preservation', () => {
		it('should preserve URLs in queries', () => {
			const entities = (translator as any).extractPreservedEntities(
				'Visit https://example.com for docs'
			);
			
			expect(entities.some((e: any) => e.type === 'url')).toBe(true);
		});

		it('should preserve code blocks in queries', () => {
			const entities = (translator as any).extractPreservedEntities(
				'Run `npm install` command'
			);
			
			expect(entities.some((e: any) => e.type === 'code')).toBe(true);
		});

		it('should remove overlapping entities', () => {
			const entities = (translator as any).extractPreservedEntities(
				'The React framework'
			);
			
			const cleaned = (translator as any).removeOverlappingEntities(entities);
			
			const hasOverlap = cleaned.some((e: any, i: number) => 
				i > 0 && e.startIndex < cleaned[i - 1].endIndex
			);
			
			expect(hasOverlap).toBe(false);
		});
	});

	describe('needsTranslation', () => {
		it('should return true for non-English queries', () => {
			expect(translator.needsTranslation('你好世界，这是一个测试')).toBe(true);
		});

		it('should return true for low-confidence short text', () => {
			expect(translator.needsTranslation('xyz')).toBe(true);
		});
	});

	describe('detectLanguage', () => {
		it('should return language info for French', () => {
			const result = translator.detectLanguage('Bonjour le monde, comment allez-vous aujourd\'hui? Je voudrais apprendre la programmation.');
			
			expect(result.language).toBe('fr');
			expect(result.confidence).toBeGreaterThan(0);
			expect(result.isEnglish).toBe(false);
		});
	});
});

describe('Fallback Behavior', () => {
	it('should fallback to original text on translation failure', async () => {
		const service = new TranslationService();
		
		const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
		global.fetch = mockFetch;
		
		service.setModelConfig({
			provider: ModelProvider.OPENAI,
			model: 'gpt-4',
			baseUrl: 'https://api.openai.com/v1',
			apiKey: 'test-key',
			temperature: 0.7,
			maxTokens: 4096,
			timeout: 60000,
			enableStreaming: false,
		});
		
		const result = await service.translate('这是测试文本', 'en', { cache: false });
		
		expect(result.translated).toBe('这是测试文本');
	});

	it('should handle mixed-language text', async () => {
		const detector = new LanguageDetector();
		const result = detector.detect('Hello 你 world 世界 test 测试');
		
		expect(result.confidence).toBeGreaterThan(0);
	});
});
