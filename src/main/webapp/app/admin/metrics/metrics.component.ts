/**
 * Copyright 2017-2023 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster Online project, see https://github.com/jhipster/jhipster-online
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { combineLatest } from 'rxjs';

import { MetricsService, Metrics, MetricsKey, Thread } from './metrics.service';

@Component({
  selector: 'jhi-metrics',
  templateUrl: './metrics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsComponent implements OnInit {
  metrics?: Metrics;
  threads?: Thread[];
  updatingMetrics = true;

  constructor(private metricsService: MetricsService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.updatingMetrics = true;
    combineLatest([this.metricsService.getMetrics(), this.metricsService.threadDump()]).subscribe(([metrics, threadDump]) => {
      this.metrics = metrics;
      this.threads = threadDump.threads;
      this.updatingMetrics = false;
      this.changeDetector.markForCheck();
    });
  }

  metricsKeyExists(key: MetricsKey): boolean {
    return this?.metrics && this.metrics[key];
  }

  metricsKeyExistsAndObjectNotEmpty(key: MetricsKey): boolean {
    return this?.metrics && this.metrics[key] && JSON.stringify(this.metrics[key]) !== '{}';
  }
}
