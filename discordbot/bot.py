import discord, requests as r, pickle, os.path as p
from dotenv import dotenv_values
from discord import app_commands

from datetime import date
from datetime import datetime

from datetime import datetime, timedelta

import random

token = dotenv_values(".env")["TOKEN"]
intents = discord.Intents.default()
intents.message_content = True

admins = []
counter = 0
highest_count = 0

class FrogeBot(discord.Client):
    def __init__(self):
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)
        print("[SYS] Bot initialized...")
    
    async def setup_hook(self):
        await self.tree.sync()
        print("[SYS] Command tree synced.")

bot = FrogeBot()

async def frogeEmbed(title, desc, color=discord.Color.blue()):
    embed = discord.Embed(title=title, description=desc, color=color).set_footer(text="FrogeBot", icon_url="https://cdn.discordapp.com/avatars/1354202550043414680/b4e81a2ffc0b63ea27fb5a5db9567728.webp")
    return embed

if p.exists("admins.pkl"):
    admins_pkl = open("admins.pkl", "rb")
    admins = pickle.loads(admins_pkl.read())
    admins_pkl.close()

if len(admins) == 0:
    admins = [int(a) for a in dotenv_values(".env")["DEFAULT_ADMINS"].split(',')]

async def permcheck(inter: discord.Interaction) -> bool:
    if inter.user.id not in admins:
        await inter.response.send_message(embed = await frogeEmbed("Permission Denied", "This action is not permitted! You are not an admin!", discord.Color.red()))
        return False
    return True

@bot.event
async def on_ready():
    print("[SYS] Logged in as", bot.user.name)
    print(f"[SYS] Admin users: {", ".join([(await bot.fetch_user(a)).name for a in admins])}")

@bot.tree.command( name="ping", description="Checks if the bot is online." )
async def ping(inter: discord.Interaction):
    print("[CMD] server ping!")
    await inter.response.send_message(embed = await frogeEmbed("Ping - Success", "Happy Forge.", discord.Color.green()))

async def hmsify(seconds: int) -> str:
    hours = round(seconds // 3600)
    minutes = round((seconds % 3600) // 60)
    seconds = round(seconds % 60)
    return f"{hours}h {minutes}m {seconds}s"

@bot.tree.command( name="status", description="Checks the status of all machines." )
async def status(inter: discord.Interaction):
    print("[CMD] machine stats!")
    out_str = ""

    try:
        status_obj = r.get("http://backend:8000/machinestatus", headers={"accept": "application/json"}).json()
        # status_obj = json.loads(json_dat)
        for group in status_obj["groups"]:
            out_str += "## " + group["name"] + "\n"
            for mach in group["machines"]:

                if not mach["in_use"] and not mach["failed"]:
                    out_str += f':white_circle: **{mach["name"]}**: Available\n'
                    continue

                if mach["failed"]:
                    out_str += f':x: **{mach["name"]}**: Failed\n'
                    continue

                if mach["maintenance_mode"]:
                    out_str += f'**:construction: {mach["name"]}**: Under Maintenance\n'
                    continue

                if mach["in_use"] and not mach["failed"]:
                    # Calculate the difference in seconds from usage_end to now
                    datetime_now = datetime.now()
                    estimated_time_left = 0

                    usage_duration = mach["usage_duration"]
                    usage_start = mach["usage_start"]

                    usage_start_day = usage_start.split("T")[0]
                    usage_start_time = usage_start.split("T")[1]

                    usage_start_year = int(usage_start_day.split("-")[0])
                    usage_start_month = int(usage_start_day.split("-")[1])
                    usage_start_day = int(usage_start_day.split("-")[2])

                    usage_start_hour = int(usage_start_time.split(":")[0])
                    usage_start_minute = int(usage_start_time.split(":")[1])
                    usage_start_second = int(usage_start_time.split(":")[2][0:2])

                    usage_start_datetime = datetime(usage_start_year, usage_start_month, usage_start_day, usage_start_hour, usage_start_minute, usage_start_second)
                    usage_end_datetime = usage_start_datetime + timedelta(seconds=usage_duration)
                    estimated_time_left = (usage_end_datetime - datetime_now).total_seconds()
                    out_str += (f':hourglass_flowing_sand:' if estimated_time_left > 0 else ":white_check_mark:") + f" **{mach["name"]}**: {"In Progress - " + await hmsify(estimated_time_left) + " until completion" if estimated_time_left > 0 else "Completed"} \n"
    except Exception as e:
        out_str += f"```\nERROR: {str(e)}\n```"
    
    await inter.response.send_message(embed = await frogeEmbed("Machine Usage", out_str, discord.Color.green()))

@bot.tree.command( name="add-admin", description="Adds a user as an admin." )
async def add_admin(inter: discord.Interaction, user: discord.User):
    if not await permcheck(inter): return
    try:
        if user.id in admins:
            await inter.response.send_message(embed = await frogeEmbed("Add Admin - Error", f"User {user.display_name} is already an admin.", discord.Color.red()))
            return
        admins.append(user.id)
        
        with open("admins.pkl", "wb") as admins_pkl:
            pickle.dump(admins, admins_pkl)

        await inter.response.send_message(embed = await frogeEmbed("Add Admin - Success", f"Added user {user.display_name} as an admin.", discord.Color.green()))
        print(f"[CMD] Added user {user.display_name} as an admin.")
        print(f"[CMD] Admin users: {", ".join([(await bot.fetch_user(a)).name for a in admins])}")
    except Exception as e:
        await inter.response.send_message(embed = await frogeEmbed("Add Admin - Failed", f"User {user.display_name} could not be added as an admin because:\n```\n{e}\n```", discord.Color.red()))

@bot.tree.command( name="del-admin", description="Removes an admin's permissions." )
async def del_admin(inter: discord.Interaction, user: discord.User):
    if not await permcheck(inter): return
    try:
        if not user.id in admins:
            await inter.response.send_message(embed = await frogeEmbed("Remove Admin - Error", f"User {user.display_name} is not an admin.", discord.Color.red()))
            return
        elif user.id == inter.user.id:
            await inter.response.send_message(embed = await frogeEmbed("Remove Admin - Error", f"Removing yourself from admin seems like a bad idea.", discord.Color.red()))
            return
        admins.remove(user.id)
        
        with open("admins.pkl", "wb") as admin_pkl:
            pickle.dump(admins, admin_pkl)

        await inter.response.send_message(embed = await frogeEmbed("Remove Admin - Success", f"Removed user {user.display_name} from admin.", discord.Color.green()))
        print(f"[CMD] Removed user {user.display_name} from admin.")
        print(f"[CMD] Admin users: {", ".join([(await bot.fetch_user(a)).name for a in admins])}")
    except Exception as e:
        await inter.response.send_message(embed = await frogeEmbed("Remove Admin - Failed", f"User {user.display_name} could not be removed from admin because:\n```\n{e}\n```", discord.Color.red()))

@bot.tree.command( name="count", description="Increments a counter. There is a 1 in 10 chance that this will instead reset the counter." )
async def count(inter: discord.Interaction):
    global counter
    global highest_count
    if random.randint(1,10) == 1:
        prev_count = counter
        counter = 0
        print("[CMD] Counter reset to 0.")
        messages = [
            f"This is all {inter.user.mention}'s fault.",
            f"{inter.user.mention} has doomed us all.",
            f"{inter.user.mention} did this to all of us.",
            f"Blame {inter.user.mention}.",
            f"{inter.user.mention} did this. Their coordinates are 42.7290739, -73.6795348.",
        ]
        await inter.response.send_message(embed = await frogeEmbed("Count - Lost", f"**The counter has been reset to 0.** {random.choice(messages)}\nThe count was {prev_count}. The all-time highest count is {highest_count}.\n{"**This was previously the all-time highest count.** Sorry for your loss." if prev_count == highest_count else ""}", discord.Color.yellow()))
    else:
        counter += 1
        print(f"[CMD] Counter incremented to {counter}.")
        highest_count = max(highest_count, counter)
        await inter.response.send_message(embed = await frogeEmbed("Count - Incremented", f"**The counter has been incremented to {counter}.**\nThe all-time highest count is {highest_count}.", discord.Color.green()))

print("Commands: " + ", ".join([cmd.name for cmd in bot.tree.get_commands()]))
bot.run(token)