<template>
  <v-app id="inspire">
    <v-app-bar app color="white" flat>
      <v-container class="py-0 fill-height">
        <v-avatar class="mr-10" color="grey darken-1" size="32"></v-avatar>

        <v-btn v-for="link in links" :key="link" text>
          {{ link }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="260">
          <v-text-field dense flat hide-details rounded solo-inverted>
          </v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet elevation="2" rounded="lg">
              <v-list color="transparent" dense>
                <v-subheader>ENTRIES</v-subheader>
                <v-list-item-group 
                  v-model="selectedItem" 
                  color="primary"
                  mandatory
                >
                  <v-list-item
                    v-for="(entry, index) in entries"
                    :key="index"
                    @click="entryClicked(index)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        Entry #{{ index + 1 }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ entry.date }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey">
                  <v-list-item-content>
                    <v-list-item-title> Refresh </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col v-if="entries.length">
            <v-card min-height="70vh" rounded="lg" class="d-flex flex-column">
              <v-card-title>
                {{ this.entries[selectedItem].title + " index:" + this.selectedItem}}
              </v-card-title>
              <v-card-subtitle v-model="id">
                {{this.entries[selectedItem].id}}
              </v-card-subtitle>
              <v-card-subtitle>
                {{ this.entries[selectedItem].date }}
              </v-card-subtitle>
              <v-card-text>
                {{ this.entries[selectedItem].content }}
              </v-card-text>
              <v-spacer></v-spacer>
                <v-btn @click="delEntry()" class="mx-2 mb-2" fab dark small color="red">
                  <v-icon dark> mdi-delete </v-icon>
                </v-btn>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">New Diary Entry</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="title"
                        label="Title"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="content"
                        name="entry"
                        filled
                        label="Content"
                        auto-grow
                        value=""
                      ></v-textarea>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="mood"
                        :items="[
                          'Happy',
                          'Sad',
                          'Angry',
                          'Worried',
                          'Excited',
                          'Bored',
                          'Scared',
                          'Tired',
                          'Sleepy',
                          'Confused',
                        ]"
                        label="Mood"
                        multiple
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="(dialog = false), addDiaryEntry()"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-btn class="mx-2" fab dark large color="green" @click="dialog = true">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { deleteEntry, createEntry, getEntries } from "../firebase";

export default {
  name: "App",

  components: {},

  async created() {
    this.date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10);
      this.getDiaryEntries();
  },

  data: () => ({
    //Diary Entry
    id: "",
    title: "",
    content: "",
    mood: "",

    date: null,

    dialog: false,

    selectedItem: 0,

    links: ["Dashboard", "Messages", "Profile", "Updates", "Settings"],

    entry: {
      id: "",
      title: "",
      content: "",
      mood: "",
      date: "",
    },
//comment
    entries: [],
  }),

  methods: {
    logDate: function () {
      console.log(this.date);
    },

    entryClicked: function (index) {
      this.id = this.entries[index].id;
      console.log(this.id)
    },
    
    delEntry: async function () {
      this.entries.splice(this.selectedItem, 1);
      await deleteEntry(this.id);
      console.log("deleting" + this.id);
      this.selectedItem = 0;
    },

    /* saveEntry: function () {
      this.entries.push({
        id: this.entries.length + 1,
        title: this.title,
        date: this.date,
        content: this.content,
        mood: this.mood,
      });
      this.title = "";
      this.content = "";
      this.mood = "";
    }, */

    /* addEntry: async function () {
      await createEntry(this.title, this.date, this.content, this.mood);
      this.title = "";
      this.date = "";
      this.content = "";
      this.mood = "";
    }, */

    //then save shit to entries
    getDiaryEntries: async function () {
      const data = await getEntries();
      data.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        this.entries.push(doc.data());
        //console.log(this.entry)
      });
      this.id = this.entries[this.selectedItem].id;
      console.log(this.id)
    },

    addDiaryEntry: async function () {
      this.id = Date.now().toString();
      this.entry = {
        id: this.id,
        title: this.title,
        content: this.content,
        mood: this.mood,
        date: this.date,
      };
      await createEntry(this.entry, this.id);
      this.entries.push(this.entry);
      this.id = "";
      this.title = "";
      this.content = "";
      this.mood = "";
    },
  },
};
</script>
