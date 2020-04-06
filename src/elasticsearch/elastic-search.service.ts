import { Injectable, Inject, forwardRef } from "@nestjs/common";
import elasticsearch, { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { EntryCodesService } from "../tests/entry-codes.service";
import { EntryCode, EntryCodeStatus } from "../tests/entry-code.entity";
import { ConfigService } from "@nestjs/config";
import { LoggingService } from "../logging/logging.service";

@Injectable()
export class ElasticSearchService {

  elasticSearchClient: ElasticSearchClient;

  constructor(
    @Inject(forwardRef(() => EntryCodesService))
    private readonly entryCodesService: EntryCodesService,
    private configService: ConfigService,
    private readonly loggingService: LoggingService
  ) {
    const client = new elasticsearch.Client({
      node: configService.get('ELASTICSEARCH_URL')
    });
    client.ping().then((resp) => {
      if (resp.statusCode == 200) {
        loggingService.info('Connecting to Elasticsearch was successful.');
      }
    })
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

  async addResultToEntryCode(entryCode, result) {
    await this.elasticSearchClient.index({
      index: 'quizio-entry-codes',
      id: entryCode.id,
      body: {
        id: entryCode.id,
        code: entryCode.code,
        name: entryCode.name,
        status: entryCode.status.toString(),
        testId: entryCode.test.id,
        result
      }
    })
  }

  async searchForUnfinishedEntryCode(searchTerm: string, testId = null, mustNotStatus = null) {
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

  async searchForFinishedEntryCode(searchTerm: string, testId = null) {
    const { body } = await this.elasticSearchClient.search({
      index: 'quizio-entry-codes',
      body: {
        query: {
          bool: {
            must: [
              {
                term: { testId }
              },
              {
                match: {
                  status: EntryCodeStatus.DONE.toString()
                }
              }
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
          }
        }
      }
    })
    const results: any[] = body.hits.hits;
    return results.map(result => result['_source']);
  }
}