export * from "./extractor";
export * from "./graph";
export * from "./types";

import { createEntityExtractor, EntityExtractor } from "./extractor";
import { createKnowledgeGraph, KnowledgeGraph } from "./graph";

export async function buildGraphFromText(
	text: string,
	graph?: KnowledgeGraph,
	extractor?: EntityExtractor,
): Promise<{
	graph: KnowledgeGraph;
	extractionResult: import("./types").ExtractionResult;
}> {
	const kg = graph ?? createKnowledgeGraph();
	const ext = extractor ?? createEntityExtractor();

	const result = await ext.extract(text);

	for (const entity of result.entities) {
		await kg.addEntity(entity);
	}

	for (const relationship of result.relationships) {
		try {
			await kg.addRelationship(relationship);
		} catch {
			// Skip relationships with missing entities
		}
	}

	return { graph: kg, extractionResult: result };
}

export {
	KnowledgeGraph,
	EntityExtractor,
	createKnowledgeGraph,
	createEntityExtractor,
};
