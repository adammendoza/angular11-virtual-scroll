/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { Directive, forwardRef, Input, OnChanges, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY, VirtualScrollStrategy } from '@angular/cdk/scrolling';


/** Virtual scrolling strategy for lists with items of known fixed size. */
export class NgrxVirtualScrollStrategy implements VirtualScrollStrategy {
  private _scrolledIndexChange = new Subject<number>();

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  scrolledIndexChange: Observable<number> = this._scrolledIndexChange.pipe(distinctUntilChanged());

  /** The attached viewport. */
  private _viewport: CdkVirtualScrollViewport | null = null;

  /** The size of the items in the virtually scrolling list. */
  private _itemSize: number;

  /** The minimum amount of buffer rendered beyond the viewport (in pixels). */
  private _minBufferPx: number;

  /** The number of buffer items to render beyond the edge of the viewport (in pixels). */
  private _maxBufferPx: number;

  /**
   * @param itemSize The size of the items in the virtually scrolling list.
   * @param minBufferPx The minimum amount of buffer (in pixels) before needing to render more
   * @param maxBufferPx The amount of buffer (in pixels) to render when rendering more.
   */
  constructor(itemSize: number, minBufferPx: number, maxBufferPx: number) {
    this._itemSize = itemSize;
    this._minBufferPx = minBufferPx;
    this._maxBufferPx = maxBufferPx;
  }

  /**
   * Attaches this scroll strategy to a viewport.
   * @param viewport The viewport to attach this strategy to.
   */
  attach(viewport: CdkVirtualScrollViewport) {
    console.log('[NgrxVirtualScrollStrategy] attach');
    this._viewport = viewport;
    this._updateTotalContentSize();
    this._updateRenderedRange();
  }

  /** Detaches this scroll strategy from the currently attached viewport. */
  detach() {
    this._scrolledIndexChange.complete();
    this._viewport = null;
  }

  /**
   * Update the item size and buffer size.
   * @param itemSize The size of the items in the virtually scrolling list.
   * @param minBufferPx The minimum amount of buffer (in pixels) before needing to render more
   * @param maxBufferPx The amount of buffer (in pixels) to render when rendering more.
   */
  updateItemAndBufferSize(itemSize: number, minBufferPx: number, maxBufferPx: number) {
    console.log('[NgrxVirtualScrollStrategy] updateItemAndBufferSize');
    if (maxBufferPx < minBufferPx) {
      throw Error('CDK virtual scroll: maxBufferPx must be greater than or equal to minBufferPx');
    }
    this._itemSize = itemSize;
    this._minBufferPx = minBufferPx;
    this._maxBufferPx = maxBufferPx;
    this._updateTotalContentSize();
    this._updateRenderedRange();
  }

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  onContentScrolled() {
    console.log('[NgrxVirtualScrollStrategy] onContentScrolled');
    this._updateRenderedRange();
  }

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  onDataLengthChanged() {
    console.log('[NgrxVirtualScrollStrategy] onDataLengthChanged', this);
    this._updateTotalContentSize();
    this._updateRenderedRange();
  }

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  onContentRendered() { /* no-op */ }

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  onRenderedOffsetChanged() { /* no-op */ }

  /**
   * Scroll to the offset for the given index.
   * @param index The index of the element to scroll to.
   * @param behavior The ScrollBehavior to use when scrolling.
   */
  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (this._viewport) {
      this._viewport.scrollToOffset(index * this._itemSize, behavior);
    }
  }

  /** Update the viewport's total content size. */
  private _updateTotalContentSize() {
    if (!this._viewport) {
      return;
    }
    console.warn('[NgrxVirtualScrollStrategy] _updateTotalContentSize ', this._viewport);
    this._viewport.setTotalContentSize(this._viewport.getDataLength() * this._itemSize);
  }

  /** Update the viewport's rendered range. */
  private _updateRenderedRange() {
    if (!this._viewport) {
      return;
    }
    console.warn('[NgrxVirtualScrollStrategy] _updateRenderedRange ', this);

    const renderedRange = this._viewport.getRenderedRange();
    const newRange = { start: renderedRange.start, end: renderedRange.end };
    const viewportSize = this._viewport.getViewportSize();
    const dataLength = this._viewport.getDataLength();
    let scrollOffset = this._viewport.measureScrollOffset();
    let firstVisibleIndex = scrollOffset / this._itemSize;

    // If user scrolls to the bottom of the list and data changes to a smaller list
    if (newRange.end > dataLength) {
      // We have to recalculate the first visible index based on new data length and viewport size.
      const maxVisibleItems = Math.ceil(viewportSize / this._itemSize);
      const newVisibleIndex = Math.max(0,
        Math.min(firstVisibleIndex, dataLength - maxVisibleItems));

      // If first visible index changed we must update scroll offset to handle start/end buffers
      // Current range must also be adjusted to cover the new position (bottom of new list).
      if (firstVisibleIndex != newVisibleIndex) {
        firstVisibleIndex = newVisibleIndex;
        scrollOffset = newVisibleIndex * this._itemSize;
        newRange.start = Math.floor(firstVisibleIndex);
      }

      newRange.end = Math.max(0, Math.min(dataLength, newRange.start + maxVisibleItems));
    }

    const startBuffer = scrollOffset - newRange.start * this._itemSize;
    if (startBuffer < this._minBufferPx && newRange.start != 0) {
      const expandStart = Math.ceil((this._maxBufferPx - startBuffer) / this._itemSize);
      newRange.start = Math.max(0, newRange.start - expandStart);
      newRange.end = Math.min(dataLength,
        Math.ceil(firstVisibleIndex + (viewportSize + this._minBufferPx) / this._itemSize));
    } else {
      const endBuffer = newRange.end * this._itemSize - (scrollOffset + viewportSize);
      if (endBuffer < this._minBufferPx && newRange.end != dataLength) {
        const expandEnd = Math.ceil((this._maxBufferPx - endBuffer) / this._itemSize);
        if (expandEnd > 0) {
          newRange.end = Math.min(dataLength, newRange.end + expandEnd);
          newRange.start = Math.max(0,
            Math.floor(firstVisibleIndex - this._minBufferPx / this._itemSize));
        }
      }
    }

    this._viewport.setRenderedRange(newRange);
    this._viewport.setRenderedContentOffset(this._itemSize * newRange.start);
    this._scrolledIndexChange.next(Math.floor(firstVisibleIndex));
  }
}


/**
 * Provider factory for `NgrxVirtualScrollDirective` that simply extracts the already created
 * `NgrxVirtualScrollDirective` from the given directive.
 * @param ngrxDir The instance of `NgrxVirtualScrollDirective` to extract the
 *     `NgrxVirtualScrollDirective` from.
 */
export function _ngrxVirtualScrollStrategyFactory(ngrxDir: NgrxVirtualScrollDirective) {
  return ngrxDir._scrollStrategy;
}


/** A virtual scroll strategy that supports ngrx state. */
@Directive({
  selector: 'cdk-virtual-scroll-viewport[ngrx]',
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useFactory: _ngrxVirtualScrollStrategyFactory,
    deps: [forwardRef(() => NgrxVirtualScrollDirective)],
  }],
})
export class NgrxVirtualScrollDirective implements OnChanges {
  /** The size of the items in the list (in pixels). */
  @Input()
  get itemSize(): number { return this._itemSize; }
  set itemSize(value: number) { this._itemSize = coerceNumberProperty(value); }
  _itemSize = 10;

  /**
   * The minimum amount of buffer rendered beyond the viewport (in pixels).
   * If the amount of buffer dips below this number, more items will be rendered. Defaults to 100px.
   */
  @Input()
  get minBufferPx(): number { return this._minBufferPx; }
  set minBufferPx(value: number) { this._minBufferPx = coerceNumberProperty(value); }
  _minBufferPx = 100;

  /**
   * The number of pixels worth of buffer to render for when rendering new items. Defaults to 200px.
   */
  @Input()
  get maxBufferPx(): number { return this._maxBufferPx; }
  set maxBufferPx(value: number) { this._maxBufferPx = coerceNumberProperty(value); }
  _maxBufferPx = 200;

  /** The scroll strategy used by this directive. */
  _scrollStrategy =
    new NgrxVirtualScrollStrategy(this.itemSize, this.minBufferPx, this.maxBufferPx);

  ngOnChanges() {
    this._scrollStrategy.updateItemAndBufferSize(this.itemSize, this.minBufferPx, this.maxBufferPx);
  }

  static ngAcceptInputType_itemSize: NumberInput;
  static ngAcceptInputType_minBufferPx: NumberInput;
  static ngAcceptInputType_maxBufferPx: NumberInput;
}
