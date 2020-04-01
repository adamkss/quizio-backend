import { Injectable, Inject, forwardRef } from "@nestjs/common";
import elasticsearch, { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { EntryCodesService } from "../tests/entry-codes.service";
import { EntryCode } from "../tests/entry-code.entity";

@Injectable()
export class ElasticSearchService {

  elasticSearchClient: ElasticSearchClient;

  constructor(
    @Inject(forwardRef(() => EntryCodesService))
    private readonly entryCodesService: EntryCodesService
  ) {
    const client = new elasticsearch.Client({
      node: 'https://search-quizio-tujwztn6qj2crkxfzjvel54nza.us-east-2.es.amazonaws.com'
    });
    this.elasticSearchClient = client;
  }

  async deleteEverythingFromIndex(indexName) {
    return await this.elasticSearchClient.deleteByQuery({
      index: indexName,
      body: {
        query: {
          match_all: {}
        }
      }
    })
  }

  async copyAllEntryCodesToElasticsearch() {
    const entryCodes: EntryCode[] = await this.entryCodesService.getAllEntryCodesWithOwningTest();
    entryCodes.forEach(entryCode => {
      this.copyEntryCodeToElasticsearch(entryCode);
    })
  }

  async copyEntryCodeToElasticsearch(entryCode) {
    await this.elasticSearchClient.index({
      index: 'quizio-entry-codes',
      id: entryCode.id,
      body: {
        id: entryCode.id,
        code: entryCode.code,
        name: entryCode.name,
        status: entryCode.status.toString(),
        testId: entryCode.test.id
      }
    })
  }

  async searchForEntryCode(searchTerm: string, testId = null, mustNotStatus = null) {
    const { body } = await this.elasticSearchClient.search({
      index: 'quizio-entry-codes',
      body: {
        query: {
          bool: {
            must: [
              {
                term: { testId }
              },
            ],
            should: [
              {
                regexp: {
                  code: `.*${searchTerm}.*`
                }
              },
              {
                multi_match: {
                  query: searchTerm,
                  fields: ['name', 'code']
                }
              }
            ],
            must_not: [
              {
                match: {
                  status: mustNotStatus
                }
              }
            ]
          }
        }
      }
    })
    const results: any[] = body.hits.hits;
    return results.map(result => result['_source']);
  }
}