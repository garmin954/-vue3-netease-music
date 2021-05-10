import {defineComponent, shallowRef, onBeforeMount, ref, nextTick, reactive, onUpdated} from 'vue';
import {ElCarousel, ElCarouselItem} from 'element-plus';
import {genImgUrl} from '@/utils';
import {getBanner} from '@/api';

import '@/assets/style/discovery/banner.scss';
export default defineComponent({
  name: 'Banner',
  components: {
    ElCarousel,
    ElCarouselItem,
  },
  setup() {

    const carousel = ref();
    const state = reactive({
      banners: [],
    });

    onBeforeMount(async () => {
      const { banners } = await getBanner();
      state.banners = banners;
    });

    // 解决只显示两种图片问题
    onUpdated(() => {
      carousel.value.next();
    });

    return () => (
      <el-carousel interval={4000} height={'260px'} class='banner-carousel' type={'card'} ref={carousel}>
        {
          state.banners.map((banner: any, index: number) => (
            <el-carousel-item key={index}>
              <img src={genImgUrl(banner.imageUrl, 700, 400)} class='banner-img'/>
            </el-carousel-item>
          ))
        }
      </el-carousel>
    );
  },
});
