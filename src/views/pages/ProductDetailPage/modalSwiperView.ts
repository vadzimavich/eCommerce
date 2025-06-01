import { elementCreator } from '../../../utils/dom-helpers';
import { ProductModel } from './productModel';
import Swiper from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

export class ProductModalSwiperView {
  public readonly buttonClose: HTMLButtonElement;
  private readonly swiper: HTMLDivElement;
  private readonly thumbsSwiper: HTMLDivElement;
  private readonly container: HTMLElement;
  private readonly buttonPrev: HTMLButtonElement;
  private readonly buttonNext: HTMLButtonElement;
  private currentSlideIndex: number = 0;

  constructor(private readonly model: ProductModel) {
    this.container = elementCreator(document.createElement('section'), {
      classNames: ['product', 'modal'],
      attributes: { id: 'modal-swiper' },
    });
    this.swiper = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__main-slider', 'swiper'],
    });
    this.thumbsSwiper = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__thumbs-swiper', 'swiper'],
    });
    this.buttonClose = elementCreator(document.createElement('button'), {
      classNames: ['button'],
      attributes: { id: 'button-close' },
    });
    this.buttonPrev = elementCreator(document.createElement('button'), {
      classNames: ['button', 'swiper-button-prev'],
      attributes: { id: 'button-swiper-prev' },
    });
    this.buttonNext = elementCreator(document.createElement('button'), {
      classNames: ['button', 'swiper-button-next'],
      attributes: { id: 'button-swiper-next' },
    });
  }

  public render(imgSource: string): void {
    this.container.append(this.createSwiperElements(imgSource));
    document.body.append(this.container);
    this.initializeSwiper();
    document.body.classList.toggle('modal_active');
  }

  public closeModal(): void {
    this.container.replaceChildren();
    this.buttonClose.replaceChildren();
    this.swiper.replaceChildren();
    this.thumbsSwiper.replaceChildren();
    this.container.remove();
    document.body.classList.toggle('modal_active');
  }

  private createSwiperElements(imgSource: string): HTMLDivElement {
    const wrapper = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper'],
    });

    const sliders = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__sliders'],
    });

    const wrapperSlider = elementCreator(document.createElement('div'), {
      classNames: ['main-swiper', 'swiper-wrapper'],
    });

    const wrapperThumbsSlider = elementCreator(document.createElement('div'), {
      classNames: ['thumbs-swiper', 'swiper-wrapper'],
    });

    this.model.dataProduct?.images?.forEach((sourcePath, index) => {
      for (let i = 0; i < 2; i++) {
        if (i === 0) {
          this.addSlide(wrapperSlider, sourcePath);
        } else {
          this.addSlide(wrapperThumbsSlider, sourcePath);
        }
      }
      if (sourcePath === imgSource) {
        this.currentSlideIndex = index;
      }
    });

    this.swiper.append(wrapperSlider);
    this.thumbsSwiper.append(wrapperThumbsSlider);

    sliders.append(this.buttonPrev, this.swiper, this.buttonNext, this.thumbsSwiper);
    wrapper.append(sliders);
    this.container.append(this.createButtonClose());
    return wrapper;
  }

  private createButtonClose(): HTMLButtonElement {
    for (let i = 0; i < 2; i++) {
      const line = elementCreator(document.createElement('div'), { classNames: ['button__line'] });
      this.buttonClose.append(line);
    }

    return this.buttonClose;
  }

  private addSlide(wrapper: HTMLElement, sourcePath: string): void {
    const wrapperImg = elementCreator(document.createElement('div'), {
      classNames: ['product__wrapper__img', 'swiper-slide'],
    });

    const img = elementCreator(document.createElement('img'), {
      classNames: ['product__img'],
      attributes: {
        src: sourcePath,
        alt: this.model.dataProduct?.title || '',
      },
    });

    wrapperImg.append(img);
    wrapper.append(wrapperImg);
  }

  private initializeSwiper(): void {
    const thumbsSwiperInstance = new Swiper(this.thumbsSwiper, {
      modules: [Navigation, Pagination, Thumbs],
      spaceBetween: 10,
      freeMode: true,
      watchSlidesProgress: true,
      navigation: true,
      breakpoints: {
        0: {
          slidesPerView: 3,
        },
        420: {
          slidesPerView: 4,
        },
        560: {
          slidesPerView: 6,
        },
        768: {
          slidesPerView: 8,
        },
      },
    });

    const swiperInstance = new Swiper(this.swiper, {
      modules: [Navigation, Pagination, Thumbs],
      navigation: {
        nextEl: this.buttonNext,
        prevEl: this.buttonPrev,
      },
      pagination: { clickable: true },
      thumbs: {
        swiper: thumbsSwiperInstance,
      },
    });

    swiperInstance.slideTo(this.currentSlideIndex, 0);
  }
}
