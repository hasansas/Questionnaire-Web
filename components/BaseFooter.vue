<template>
  <footer class="sbq-footer">
    <v-container class="main-container py-12">
      <v-divider class="mb-8" />

      <v-row dense>
        <v-col cols="12" md="5">
          <div class="d-flex align-center ga-2">
            <v-avatar size="28" class="sbq-logo">
              <span class="text-caption font-weight-bold">SB</span>
            </v-avatar>
            <div class="text-subtitle-2 font-weight-semibold">
              SB Questionnaire
            </div>
          </div>
          <div
            class="text-body-2 text-medium-emphasis mt-3"
            style="max-width: 420px"
          >
            A solid assessment platform for schools, universities, and partner
            organizations — built for clarity and scale.
          </div>
          <div class="text-caption text-medium-emphasis mt-6">
            © {{ new Date().getFullYear() }} SB Questionnaire. All rights
            reserved.
          </div>
        </v-col>

        <v-col cols="6" md="3">
          <div class="text-subtitle-2 font-weight-bold mb-3">Quick Links</div>
          <div class="d-flex flex-column ga-2">
            <v-btn
              v-for="l in footerLinks"
              :key="l"
              variant="text"
              class="justify-start px-0 text-body-2"
            >
              {{ l }}
            </v-btn>
          </div>
        </v-col>

        <v-col cols="6" md="4">
          <div class="text-subtitle-2 font-weight-bold mb-3">Resources</div>
          <div class="d-flex flex-column ga-2">
            <v-btn
              v-for="r in resources"
              :key="r"
              variant="text"
              class="justify-start px-0 text-body-2"
            >
              {{ r }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-divider class="my-0" />

    <v-container class="main-container py-8">
      <div
        :class="[
          'text-body-2 d-flex align-center',
          isMobile ? 'text-center flex-column ga-3' : '',
        ]"
      >
        <div>
          <p class="mb-0">
            {{ bottomText.copyright }}
          </p>
        </div>

        <v-spacer v-if="!isMobile" />

        <div v-if="!isMobile" class="btn-group">
          <NuxtLink :to="localePath('/privacy')" class="footer-link mr-4">
            Privacy
          </NuxtLink>
          <NuxtLink :to="localePath('/terms')" class="footer-link mr-4">
            Terms
          </NuxtLink>
          <NuxtLink
            :to="localePath({ path: '/', hash: '#faq' })"
            class="footer-link"
          >
            FAQ
          </NuxtLink>
        </div>
      </div>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
const { isMobile } = useIsMobile();
const { t } = useI18n();
const localePath = useLocalePath();

const currentYear = new Date().getFullYear();

const footerLinks = ["Features", "Pricing", "FAQ", "Changelog"];
const resources = [
  "Documentation",
  "API Reference",
  "Privacy Policy",
  "Terms of Service",
];

const bottomText = {
  copyright: t("footer.bottom.copyright", { year: currentYear }),
  poweredBy: t("footer.bottom.poweredBy", "Powered by"),
  vemobo: t("footer.bottom.vemobo", "Vemobo"),
  note: t(
    "footer.bottom.note",
    "SB Questionnaire is built for reliable, scalable assessment workflows.",
  ),
};
</script>

<style lang="scss" scoped>
.footer-link {
  color: inherit !important;
  text-decoration: none;
  opacity: 0.92;
  transition: opacity 140ms ease;
  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
}

.sbq-logo {
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
}
</style>
