from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import random
from collections import defaultdict
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory storage
professors = []
rooms = []
branches = []
subject_schedule = {}  # New storage for subject schedule

# --- Utils ---
def generate_date_slots(start_date, end_date, daily_time_slots):
    date_format = "%Y-%m-%d"
    slots = []
    current_date = datetime.strptime(start_date, date_format)
    end_date = datetime.strptime(end_date, date_format)

    while current_date <= end_date:
        if current_date.weekday() < 5:
            for time_slot in daily_time_slots:
                slot_datetime = current_date.strftime(date_format) + " " + time_slot
                slots.append(slot_datetime)
        current_date += timedelta(days=1)

    return slots

def create_calendar_schedule(professors, date_slots, rooms, subject_schedule):
    schedule = {slot: {room: {} for room in rooms} for slot in date_slots}
    remaining_hours = {p['id']: p['hours'] for p in professors}
    assigned_slots = {p['id']: [] for p in professors}

    sorted_slots = sorted(date_slots, key=lambda x: datetime.strptime(x, "%Y-%m-%d %H:%M"))
    time_slot_subjects = defaultdict(list)
    
    for subject, time in subject_schedule.items():
        time_slot_subjects[time].append(subject)

    for slot in sorted_slots:
        time_str = slot.split()[1]
        slot_subjects = time_slot_subjects.get(time_str, [])
        if len(slot_subjects) < 2:
            continue

        random.shuffle(rooms)
        random.shuffle(slot_subjects)

        for room in rooms:
            if len(slot_subjects) < 2:
                break
                
            subjects_for_room = slot_subjects[:2]
            slot_subjects = slot_subjects[2:]
            
            teachers_for_room = []
            for subject in subjects_for_room:
                # Trouver un professeur qui n'enseigne pas cette matière
                available_profs = [
                    p for p in professors 
                    if p['subject'] != subject
                    and slot not in p.get('unavailable_slots', [])
                    and remaining_hours[p['id']] > 0
                    and slot not in assigned_slots[p['id']]
                ]
                
                if not available_profs:
                    break
                    
                # Choisir le professeur avec le plus d'heures restantes
                chosen_prof = max(available_profs, key=lambda p: remaining_hours[p['id']])
                teachers_for_room.append(chosen_prof['id'])
                assigned_slots[chosen_prof['id']].append(slot)
                remaining_hours[chosen_prof['id']] -= 1
            
            if len(teachers_for_room) == 2:
                schedule[slot][room] = {
                    'subjects': subjects_for_room,
                    'teachers': teachers_for_room
                }

    return schedule
# --- API to Receive Data from Frontend ---
@app.route('/init-data', methods=['POST'])
def init_data():
    global professors, rooms, branches, subject_schedule
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    professors = data.get('professors', [])
    rooms = data.get('rooms', [])
    branches = data.get('branches', [])
    subject_schedule = data.get('subject_schedule', {})
    print(subject_schedule)
    print(rooms)
    print(professors)
    print(branches)
    
    return jsonify({'message': 'Data initialized successfully'}), 200

# --- API to Generate Schedule ---
@app.route('/generate-schedule', methods=['GET'])
def generate_schedule():
    if not professors or not rooms or not subject_schedule:
        return jsonify({'error': 'Missing required data. Please POST /init-data first with professors, rooms, and subject_schedule.'}), 400

    start_date = "2025-02-10"
    end_date = "2025-02-21"
    time_slots = ["08:30", "10:00", "11:00", "12:00", "13:00", "14:00"]
    
    date_slots = generate_date_slots(start_date, end_date, time_slots)
    schedule = create_calendar_schedule(professors, date_slots, rooms, subject_schedule)

    formatted_schedule = defaultdict(lambda: defaultdict(dict))
    for slot, room_map in schedule.items():
        date, time = slot.split()
        for room, data in room_map.items():
            if data:
                formatted_schedule[date][time][room] = data
    print(formatted_schedule)
    return jsonify(formatted_schedule)
@app.route('/schedule/<prof_id>', methods=['GET'])
def get_prof_schedule(prof_id):
    if not professors or not rooms:
        return jsonify({'error': 'Data not initialized'}), 400

    start_date = "2025-02-10"
    end_date = "2025-02-21"
    time_slots = ["08:30", "10:00", "11:00", "12:00", "13:00", "14:00"]
    date_slots = generate_date_slots(start_date, end_date, time_slots)
    # subject_schedule = {
    #     'Mathematics': '09:00', 'Physics': '10:00', 'Chemistry': '11:00',
    #     'Biology': '12:00', 'Computer Science': '13:00',
    #     'Electrical Engineering': '09:00', 'Mechanical Engineering': '10:00',
    #     'Civil Engineering': '11:00', 'Architecture': '12:00',
    #     'Industrial Engineering': '13:00',
    #     'Business Administration': '09:00', 'Finance': '10:00',
    #     'Accounting': '11:00', 'Marketing': '12:00',
    #     'Business Analytics': '13:00',
    #     'Public Health': '09:00', 'Nutrition': '10:00',
    #     'Kinesiology': '11:00', 'Neuroscience': '12:00',
    #     'Cognitive Science': '13:00'
    # }

    schedule = create_calendar_schedule(professors, date_slots, rooms, subject_schedule)

    prof_schedule = []

    for slot, room_data in schedule.items():
        for room, details in room_data.items():
            if prof_id in details.get('teachers', []):
                prof_schedule.append({
                    'datetime': slot,
                    'room': room,
                    'subjects': details['subjects'],
                    'co_teacher': [t for t in details['teachers'] if t != prof_id][0] if len(details['teachers']) == 2 else None
                })

    if not prof_schedule:
        return jsonify({'message': f'No schedule found for professor {prof_id}'}), 404

    return jsonify({'professor': prof_id, 'schedule': prof_schedule})
# --- Run ---
if __name__ == '__main__':
    app.run(debug=True)