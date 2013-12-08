import json
import math
import random
import time

event_list = [
              'Event 1',
              'Event 2',
              'Event 3',
              'Event 4',
              ]
handle_list = [
               'user1',
               'user2',
               'user3',
               'user4',
               'user5',
               'user6',
               ]
event_filename = 'events.json'
score_filename = 'scores.json'


class Scores:
    def __init__(self):
        self.scores = {}
        self.event_list = event_list[:]
        
    def add_users(self, users):
        for user in users:
            if user not in self.scores:
                self.scores[user] = {}
                for event in self.event_list:
                    self.scores[user][event] = None
                    
    def dump_scores(self):
        outdict = {}
        for handle in self.scores:
            score_array = [self.get_total(handle)]
            for event in self.event_list:
                score_array.append(self.scores[handle][event])
            outdict[handle] = score_array
        outfile = open(score_filename, 'w+')
        outfile.write(json.dumps(outdict))
        outfile.close()
    
    def get_total(self, handle):
        total = 0
        if handle not in self.scores:
            return None
        for event in self.scores[handle]:
            event_score = self.scores[handle][event]
            if event_score is not None:
                total += event_score
        return total
    def add_points(self, handle, event, points):
        if event not in self.event_list:
            raise Exception('Uknown Event')
        if handle not in self.scores:
            self.add_users([handle])    
        if self.scores[handle][event] is None:
            self.scores[handle][event] = 0
        self.scores[handle][event] += points
        

def add_random_points(scoretable):
    handle = random.choice(handle_list)
    event = random.choice(event_list)
    print 'Adding a point to %s for %s' % (handle, event)
    scoretable.add_points(handle, event, 1)

def dump_events(filename = event_filename):
    out = open(filename, 'w+')
    out.write(json.dumps(['Total'] + event_list))
    out.close()
    
def main():
    scoretable = Scores()
    dump_events()
    scoretable.add_users(handle_list)
    while True:
        add_random_points(scoretable)
        scoretable.dump_scores()
        time.sleep(1)
if __name__ == '__main__':
    main()
        
