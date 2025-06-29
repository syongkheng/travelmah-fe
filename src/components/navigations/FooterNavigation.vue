<script lang="ts" setup>
import { useNav } from '@/hooks/useNav'

const { redirectTo, redirectToPlanning, redirectToSearch } = useNav()
</script>
<template>
  <footer class="footer">
    <div class="footer-nav">
      <el-container>
        <el-aside class="side">
          <div>
            <img src="../../../public/icon-dark.svg" width="50px" />
          </div>
          <div>
            {{ 'Made by yk©' }}
          </div>
          <div>
            {{ '2025' }}
          </div>
        </el-aside>
        <el-main>
          <div>{{ 'Links' }}</div>
          <ul>
            <el-link @click="redirectTo('/')" type="primary">{{ 'Home' }}</el-link>
          </ul>
          <ul>
            <el-link @click="redirectToPlanning" type="primary">{{ 'Plan a Journey' }}</el-link>
          </ul>
          <ul>
            <el-link @click="redirectToSearch" type="primary">{{ 'View an Itinerary' }}</el-link>
          </ul>
        </el-main>
        <el-aside class="side">
          <div>
            {{ 'Start your journey' }}
          </div>
        </el-aside>
      </el-container>
    </div>
  </footer>
</template>

<style lang="css" scoped>
.footer {
  margin-top: 6em;
  background-color: #f8f9fa;
  padding: 1em;
  border-bottom: 1px solid #e9ecef;
}

.footer-nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 1em 2em 1em;
}

.side {
  width: 20%;
}

main {
  padding: 0;
}

ul {
  padding: 0;
}
</style>
