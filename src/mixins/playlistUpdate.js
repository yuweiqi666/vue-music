import { mapState } from 'vuex'
export const playlistUpdate = {
  computed: {
    ...mapState({
      playList: state => state.player.playList
    })
  },
  mounted () {
    this.handlePlayListRefresh(this.playList)
  },
  activated () {
    this.handlePlayListRefresh(this.playList)
  },
  methods: {
    handlePlayListRefresh () {
      throw new Error('component must including handlePlayListRefresh methods')
    }
  },
  watch: {
    playList: {
      handler (n, o) {
        this.handlePlayListRefresh(n)
      }
    }
  }
}
