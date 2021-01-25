import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import * as transactionsActions from '../transactions.actions';
import { Transaction } from '../models/transaction.model';
import * as fromTransactions from '../transactions.reducer';
import { TransactionsModule } from '../transactions.module';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.scss']
})
export class TransactionsPageComponent implements OnInit, OnDestroy {

  public transactionsData: any;
  public transactionsDataList: any;
  public transactionShow: any;
  public transactionItem: any;
  public tableDataSource: any;

  public onDestroy$ = new Subject();

  public ITEM_SIZE = 10;

  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    public store: Store<any>,
  ) {
   }

  ngOnInit() {

    this.store.select('transactions')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        this.transactionsData = data;
        this.transactionShow = ( data.ids && data.ids.length > 0) ? true : false;
        // this.transactionList = data.ids ? data.ids.map((id: number) => ({ id, ...data.transactions[id] })) : [];
        this.transactionsDataList = data.transactions;

        // set viewport at the end
        if (this.transactionShow) {

          this.tableDataSource = new MatTableDataSource<any>(this.transactionsDataList);
          this.tableDataSource.paginator = this.paginator;

          const viewPortRange = this.viewPort && this.viewPort.getRenderedRange() ?
          this.viewPort.getRenderedRange() : { start: 0, end: 0 };
          const viewPortItemLength = this.transactionsDataList.length;

          // trigger only if we are streaming and not at the end of page
          if (data.stream && viewPortItemLength > 0 && (viewPortRange.end !== viewPortItemLength) &&
            (viewPortRange.start !== viewPortRange.end)) {

            setTimeout(() => {
              const offset = this.ITEM_SIZE * this.transactionsDataList.length;
            });

          }

        }

      });


    this.store.dispatch({
      type: 'GET_TRANSACTIONS_START',
    });

  }

  onScroll(index: any) {

    if (this.transactionsDataList && this.transactionsDataList.length - index > 15) {
      // stop log actions stream
      this.store.dispatch({
        type: 'GET_TRANSACTIONS_STOP',
        payload: event,
      });
    } else {
      // start log actions stream
      this.store.dispatch({
        type: 'GET_TRANSACTIONS_START',
        payload: event,
      });
    }

  }

  scrollStart() {

    // triger action and get block data
    this.store.dispatch({
      type: 'GET_TRANSACTIONS_START'
    });

  }

  scrollStop() {
    // stop streaming actions
    this.store.dispatch({
      type: 'GET_TRANSACTIONS_STOP'
    });

  }

  scrollToEnd() {

    const offset = this.ITEM_SIZE * this.transactionsDataList.length;
    this.viewPort.scrollToOffset(offset);

  }

  ngOnDestroy() {

    // stop streaming actions
    this.store.dispatch({
      type: 'GET_TRANSACTIONS_STOP'
    });

    // close all observables
    this.onDestroy$.next();
    this.onDestroy$.complete();

  }

}
