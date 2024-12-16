// スライダーの処理の定義
class SliderCards{

  // スライダーの初期値
  constructor(){
    // カードの状態
    this.currentState = {
      // カードの配列の取得
      cards :[],
      // 現在のアクティブカードの取得
      activeCard : 0,
      // カードの合計枚数
      totalCards : 6,
      // 各カードの状態管理の為のオブジェクト
      // this.cardsStateMappingで使用
      cardsState :{
        // 状態管理に用いる為キーは大文字
        DEFAULT:'--default',
        NEXT:'--next',
        SUB_NEXT:'--sub-next',
        PREV:'--prev',
        SUB_PREV:'--sub-prev'
      }
    };

    // 各カードの配置に応じた挙動の初期値の設定
    // 数値は getCardState(index,totalCards)で取得
    this.cardsStateMapping = {
      // デフォルト表示
      0:this.currentState.cardsState.DEFAULT,
      // 次ページ
      1:this.currentState.cardsState.NEXT,
      // 次々ページ
      2:this.currentState.cardsState.SUB_NEXT,
      // 前ページ
      [-1]:this.currentState.cardsState.PREV,
      // 前々ページ
      [-2]:this.currentState.cardsState.SUB_PREV
    };

    // 初期化処理実行用の関数
    this.initializedCards();

    // ドットボタンのクラス：初期化
    this.initializedDotBtn();

    // イベントハンドラの設定
    // -------------
    // 卒業生の声：カルーセル：左ボタン
    this.prevBtn = document.querySelector('.b-voice-btn-left');
    // 卒業生の声：カルーセル：右ボタン
    this.nextBtn = document.querySelector('.b-voice-btn-right');
    // ---------------
    // クリックイベントの呼び出し
    this.clickEvents();

  }
  // スライダーの初期値ここまで---------------

  // 以下スライダーメソッドの定義

  // カードの取得位置から状態をスイッチングする為のメソッド
  getCardState(index,totalCards){
    let nowPosition;
    // 現在ページ
    if(index === 0){
      nowPosition = 0;
    }
    // 次ページ,次々ページ
    else if(index <= 2){
      nowPosition = index;
    }
    // 前ページ
    else if(index === totalCards - 1){
      nowPosition = -1;
    }
    // 前々ページ
    else if(index === totalCards - 2){
      nowPosition = -2;
    }

    // 現在地の取得
    return this.cardsStateMapping[nowPosition]|| '';
  }

  // 初期化処理の実行
  initializedCards(){
    // スライダーの配列の取得
    // 卒業生の声：カルーセル：カード（配列）
    const SliderCards = document.querySelectorAll('[class*="l-voice-slider-card"]');
    
    // 各カードの初期状態の定義
    SliderCards.forEach((card,index) =>{
      this.setInitialCardClass(card,index);
      this.addCardToState(card,index);
    });

    
  }
  // 初期化処理ここまで--------------

  // 初期化時に各カードにクラスを追加するメソッド
  setInitialCardClass(card,index){
    const initialState = this.getInitialState(index);
    if(initialState){
      card.classList.add(`l-voice-slider-card${initialState}`);
    }
  }

  // 初期化時に配列にカードの各状態を格納するメソッド
  addCardToState(card,index){
    const initialState = this.getInitialState(index);
    // 初期値に配列を順番に追加
    this.currentState.cards.push({
      // カード番号(DOM要素の取得)
      element: card,
      // カードの配列番号
      index: index,
      // 現在のカード状態の判定
      nowCardState: initialState,
      // カードの配置
      position: index
    });
  }

  // カードの状態を取得するメソッド
  getInitialState(index){
    switch (index){
      case 0:
        return this.currentState.cardsState.DEFAULT;
      case 1:
        return this.currentState.cardsState.NEXT;
      case 2:
        return this.currentState.cardsState.SUB_NEXT;
      default:
        return this.getCardState(index,this.currentState.totalCards);
    }
  }

  // クリックイベントの実行
  clickEvents(){
    // 1行で完結する為、中括弧は省略
    this.prevBtn.addEventListener('click',() =>{
      this.slideToPrev()
    }
  );
    // 同上
    this.nextBtn.addEventListener('click',() =>{
      this.slideToNext()
    }
  );
  }
  // クリックイベントここまで------------

  // スライド:インデックス計算用メソッド
  // ---------
  // 次ページへのスライド
  slideToNext(){
    // 次ページにカードがあるかどうかのチェック
    const nextIndex = (this.currentState.activeCard + 1) % this.currentState.totalCards;
    this.updateSliderState('next',nextIndex);
  }

  // 前ページへのスライド
  slideToPrev(){
    // 前ページにカードがあるかどうかのチェック
    const prevIndex = (this.currentState.activeCard - 1 + this.currentState.totalCards) % this.currentState.totalCards;
    this.updateSliderState('prev',prevIndex);
  }
  // スライド:インデックス計算用メソッドここまで------------

  // スライド：状態更新用メソッド
  updateSliderState(direction,newActiveIndex){
    // ドット用：現在のアクティブカード情報の取得
    const oldActiveIndex = this.currentState.activeCard;
    // アクティブカードの更新
    this.currentState.activeCard = newActiveIndex;
    // // ドット用；更新後のアクティブカードの情報の取得
    // const newActiveIndex = this.currentState.activeCard;

    // それ以外のカードの更新
    this.currentState.cards.forEach((card,index) =>{
      // アクティブカードの相対位置から計算
      const newState = this.getCardState(
        (index - newActiveIndex + this.currentState.totalCards) % this.currentState.totalCards,
        this.currentState.totalCards);

      // DOMの更新
      this.updateCardClasses(card.element,card.nowCardState,newState);

      // カード状態の更新
      card.nowCardState = newState;
    });
    // ドットボタンの連携機能の追加
    this.updateDotButton(oldActiveIndex,newActiveIndex);
  }
  // スライド：状態更新用メソッドここまで-------------

  // クラスの更新用メソッド
  updateCardClasses(element,oldState,newState){
    // 現状のクラスの削除
    if(oldState){
      element.classList.remove(`l-voice-slider-card${oldState}`);
    }
    
    // 新しい状態のクラスの追加
    if(newState){
      element.classList.add(`l-voice-slider-card${newState}`);
    }
  }

  // ドットボタン初期化時のクラス付与用メソッド
  initializedDotBtn(){
    const initialButton = document.querySelector(`[class*="b-voice-dot-box${this.currentState.activeCard + 1}__btn"]`);
    initialButton.classList.add(`b-voice-dot-box${this.currentState.activeCard + 1}__btn--active`);
  }

  // ドット:activeクラス更新用のメソッド
  updateDotButton(oldActiveIndex,newActiveIndex){
    // 現在のactiveクラスの削除
    const oldBtn = document.querySelector(`[class*="b-voice-dot-box${oldActiveIndex + 1}__btn"]`);
    if(oldBtn){
        oldBtn.classList.remove(`b-voice-dot-box${oldActiveIndex + 1}__btn--active`);
      }
      
      // 新しい状態に基づいたactiveクラスの追加
    const newBtn = document.querySelector(`[class*="b-voice-dot-box${newActiveIndex + 1}__btn"]`);
    if(newBtn){
      newBtn.classList.add(`b-voice-dot-box${newActiveIndex + 1}__btn--active`);
    }
  }
}

const Slider =new SliderCards;